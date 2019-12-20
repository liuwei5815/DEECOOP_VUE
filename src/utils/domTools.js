class DOMAPI {
  hasClass(ele, cls){
    return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"))
  }
  addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls
  }
  removeClass(ele, cls) {
    if (this.hasClass(ele, cls)) {
      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)")
      ele.className = ele.className.replace(reg, "")
    }
  }
  toggleClass(ele,cls){
    if(this.hasClass(ele,cls)){
      this.removeClass(ele, cls)
    }else{
      this.addClass(ele, cls)
    }
  }
  on(element, event, handler){
    if(element && event && handler){
      if(document.addEventListener){
        element.addEventListener(event, handler, false)
      }else {
        element.attachEvent('on' + event, handler)
      }
    }else {
      if(!element) throw new Error('element is undefined');
      if(!event) throw new Error('event is undefined');
      if(!handler) throw new Error('handler is undefined');
    }
  }
  off(element, event, handler){
    if(element && event){
      if(document.removeEventListener){
        element.removeEventListener(event, handler, false)
      }else {
        element.detachEvent('on' + event, handler)
      }
    }else {
      if(!element) throw new Error('element is undefined');
      if(!event) throw new Error('event is undefined');
      if(!handler) throw new Error('handler is undefined');
    }
  }
}

export default new DOMAPI()
