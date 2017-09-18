$.fn.translate = function() {
  this.each(function(){
    setupTranslatable(this);
  });
  return this;
};

function setupTranslatable(element){
  if (element.getElementsByClassName('translate-link').length == 0){
    btn = createTranslateButton(element);
    element.appendChild(btn);
  }
}

function createTranslateButton(element) {
  var btn = document.createElement("p");
  btn.innerHTML = '<a>'+I18n.t("platform.translations.translate")+'</a>';
  btn.className = 'translate-link';
  btn.addEventListener('click', function() { translate(element) });
  return btn;
}

function translate(element){
  var translatedElements = element.parentElement.getElementsByClassName('translated');
  if (translatedElements.length > 0){
    showOriginal(element,translatedElements[0]);
  }
  else {
    $.ajax({
      url: "/translator/translate",
      type: "POST",
      data: {"text": element.innerHTML},
      success: function(data) {
        translateText(element, data);
      }.bind(this)
    })
  }
}

function showOriginal(element, original){
  element.style.display = 'none';
  original.style.display = 'block';
}

function translateText(element, data) {
  var translatedElement = element.cloneNode();
  translatedElement.innerHTML = data.text;
  translatedElement.classList.remove("translatable");
  translatedElement.classList.add("translated");

  var btn = document.createElement('p');
  btn.innerHTML = '<a>'+I18n.t("platform.translations.show_original")+'</a>';
  btn.className = 'show-original-link';
  btn.addEventListener('click', function(e) {
    showOriginal(translatedElement, element)
  });

  translatedElement.appendChild(btn);

  element.parentElement.insertBefore(translatedElement, element);
  element.style.display = 'none';
}

var ready = function() {
  var enabled = typeof(window.ENABLE_TRANSLATOR) == "undefined" ? true : Boolean(window.ENABLE_TRANSLATOR);
  if(enabled) {
    $(".translatable:not(:has(.translate-link))").translate();

    $('body').on('DOMNodeInserted', function() {
      $(".translatable:not(:has(.translate-link))").translate()
    });
  }
};

$(document).ready(ready);
$(document).on('turbolinks:load',ready);

