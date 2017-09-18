$.fn.translate = function() {
   function setupTranslatable(element){
      if (element.getElementsByClassName('translate-link').length == 0){
        btn = createTranslateButton(element);
        element.appendChild(btn);
      }
    };

    function createTranslateButton(element) {
      var btn = document.createElement("p");
      btn.innerHTML = '<a>'+(typeof(I18n) !== 'undefined' ? I18n.t("translator.translate-button") : "Show original")+'</a>';
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
        var translatedData = getLocalData(element.innerHTML);
        if(translatedData){
          translateText(element, translatedData );
        }
        else {
          $.ajax({
            url: "/translator/translate",
            type: "POST",
            data: {"text": element.innerHTML},
            success: function(data) {
              translateText(element, data.text);
              setLocalData(element.innerHTML, data.text);
            }.bind(this)
          })
        }
      }
    };

    function showOriginal(element, original){
      element.style.display = 'none';
      original.style.display = 'block';
    };


    function translateText(element, text) {
      var translatedElement = element.cloneNode();
      translatedElement.innerHTML = text;
      translatedElement.classList.remove("translatable");
      translatedElement.classList.add("translated");

      var btn = document.createElement('p');
      btn.innerHTML = '<a>'+(typeof(I18n) !== 'undefined' ? I18n.t("translator.original-button") : "Translate")+'</a>';
      btn.className = 'show-original-link';
      btn.addEventListener('click', function(e) {
        showOriginal(translatedElement, element);
      });

      translatedElement.appendChild(btn);

      element.parentElement.insertBefore(translatedElement, element);
      element.style.display = 'none';
    };

    // Cache translations in localstorage
    function hash(str){
      var hash = 0;
      if (str.length == 0) return hash;
      for (i = 0; i < str.length; i++) {
          char = str.charCodeAt(i);
          hash = ((hash<<5)-hash)+char;
          hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    };

    function getLocalData(original){
      return localStorage.getItem('trans_'+ hash(original));
    };

    function setLocalData(original, translated){
      localStorage.setItem('trans_'+hash(original), translated);
    };
  this.each(function(){
    setupTranslatable(this);
  });
};



var ready = function() {
  var enabled = typeof(window.ENABLE_TRANSLATOR) == "undefined" ? true : Boolean(window.ENABLE_TRANSLATOR);
  if(enabled) {
    $(".translatable:not(:has(.translate-link))").translate();

    $('body').on('DOMNodeInserted', function() {
      $(".translatable:not(:has(.translate-link))").translate();
    });
  }
};

$(document).ready(ready);
$(document).on('turbolinks:load',ready);

