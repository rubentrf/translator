
$.fn.translate = function() {

  function createTranslateWrapper(element){

    var wrapper = document.createElement('div');
    wrapper.classList.add("translatable-wrapper");
    var element2 = element.cloneNode(true);
    wrapper.appendChild(element2)

    if (element.parentNode) {
      element.parentNode.replaceChild(wrapper, element);
      createTranslateButtons(wrapper, element2);
    }
  };

  function createTranslateButtons(wrapper, element) {
    var trans_btn = document.createElement("p");
    trans_btn.innerHTML = '<a href="javascript:void(0)"><i class="fa fa-globe"></i> '+(typeof(I18n) !== 'undefined' ? I18n.t("translator.translate-button") : "Show original")+'</a>';
    trans_btn.className = 'translate-link';
    trans_btn.addEventListener('click', function() { translate(element); });

    var orig_btn = document.createElement('p');
    orig_btn.innerHTML = '<a href="javascript:void(0)"><i class="fa fa-globe"></i> '+(typeof(I18n) !== 'undefined' ? I18n.t("translator.original-button") : "Translate")+'</a>';
    orig_btn.className = 'show-original-link';
    orig_btn.style.display = 'none';
    orig_btn.addEventListener('click', function(e) { showOriginal(element);});

    var btn_bucket = $(wrapper).find(".translate-link-bucket")
    btn_bucket = btn_bucket.length ? btn_bucket.get(0) : wrapper;
    btn_bucket.appendChild(trans_btn)
    btn_bucket.appendChild(orig_btn);
  };

  function translate(element){
    if (element.classList.contains('translatable-group')){

      var child_elements = element.getElementsByClassName('translatable-group-item')

      for (var i=0, item; item = child_elements[i]; i++) {
        translate(item);
      }
    }
    else {
      var translatedElements = element.parentElement.getElementsByClassName(element.classList.toString() + " translated");
      if (translatedElements.length > 0){
        showTranslatedText(element);
      }
      else {
        var translatedData = getLocalData(element.innerHTML);
        if(translatedData){
          translateText(element, translatedData);
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
    }
  };

  function showTranslatedText(element) {
    var wrapper = $(element.closest('.translatable-wrapper'));
    var translated_elements = wrapper.find('.translatable-group-item.translated, .translatable.translated, .show-original-link');
    var original_elements = wrapper.find('.translatable-group-item:not(.translated), .translatable:not(.translated), .translate-link');
    translated_elements.css('display', '');
    original_elements.css('display', 'none');
  };

  function showOriginal(element) {
    var wrapper = $(element.closest('.translatable-wrapper'));
    var translated_elements = wrapper.find('.translatable-group-item.translated, .translatable.translated, .show-original-link');
    var original_elements = wrapper.find('.translatable-group-item:not(.translated), .translatable:not(.translated), .translate-link');
    translated_elements.css('display', 'none');
    original_elements.css('display', '');
  };

  function translateText(element, text) {
    var translatedElement = element.cloneNode(true);
    translatedElement.innerHTML = text;
    translatedElement.classList.add("translated");
    element.parentElement.insertBefore(translatedElement, element);
    showTranslatedText(element);
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
    createTranslateWrapper(this);
  });
};

var ready = function() {
  var enabled = typeof(window.ENABLE_TRANSLATOR) == "undefined" ? true : Boolean(window.ENABLE_TRANSLATOR);
  if(enabled) {
    $(".translatable").not($(".translatable-wrapper .translatable")).translate();
    $(".translatable-group").not($(".translatable-wrapper .translatable-group")).translate();

    $('body').on('DOMNodeInserted', function() {
      $(".translatable").not($(".translatable-wrapper .translatable")).translate();
      $(".translatable-group").not($(".translatable-wrapper .translatable-group")).translate();
    });
  }
};

$(document).ready(ready);
$(document).on('turbolinks:load',ready);
