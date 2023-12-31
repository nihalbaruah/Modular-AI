window.isMobile = !1;
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  window.isMobile = !0;
}

function t_throttle(fn, threshhold, scope) {
  var last;
  var deferTimer;
  threshhold || (threshhold = 250);
  return function () {
    var context = scope || this;
    var now = +new Date();
    var args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

function t654_showPanel(recId) {
  var rec = document.getElementById("rec" + recId);
  if (!rec) return;
  var container = rec.querySelector(".t654");
  if (!container) return;
  var buttonClose = rec.querySelector(".t654__icon-close");
  var storageItem = container.getAttribute("data-storage-item");
  var delta = container.getAttribute("data-storage-delta") * 86400;
  var today = Math.floor(Date.now() / 1000);
  var lastOpen = null;
  var currentDelta;
  if (typeof localStorage === "object") {
    try {
      lastOpen = localStorage.getItem(storageItem);
      currentDelta = today - lastOpen;
    } catch (e) {
      console.log("Your web browser does not support localStorage.");
    }
  }
  if (lastOpen === null || currentDelta >= delta) {
    container.classList.remove("t654_closed");
  }
  buttonClose.addEventListener("click", function (event) {
    container.classList.add("t654_closed");
    if (delta) {
      if (typeof localStorage === "object") {
        try {
          localStorage.setItem(storageItem, Math.floor(Date.now() / 1000));
        } catch (e) {
          console.log("Your web browser does not support localStorage.");
        }
      }
    }
    event.preventDefault();
  });
  if (window.innerWidth > 980) {
    window.addEventListener(
      "scroll",
      t_throttle(function () {
        if (
          container.classList.contains("t654_bottom") &&
          document.getElementById("tildacopy") &&
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 70
        ) {
          container.style.visibility = "hidden";
        } else {
          var appearOffset = container.getAttribute("data-appearoffset");
          if (!appearOffset) {
            container.style.visibility = "visible";
          }
        }
      })
    );
  }
}

function t654_setBg(recId) {
  var rec = document.getElementById("rec" + recId);
  if (!rec) return;
  var container = rec.querySelector(".t654");
  if (!container) return;
  if (window.innerWidth > 980) {
    if (container.getAttribute("data-bgcolor-setbyscript") === "yes") {
      container.style.backgroundColor =
        container.getAttribute("data-bgcolor-rgba");
    }
  } else {
    container.style.backgroundColor =
      container.getAttribute("data-bgcolor-hex");
    container.setAttribute("data-bgcolor-setbyscript", "yes");
  }
}

function t654_appearMenu(recId) {
  var rec = document.getElementById("rec" + recId);
  if (!rec) return;
  var container = rec.querySelector(".t654");
  if (!container) return;
  if (window.innerWidth > 980) {
    var appearOffset = container.getAttribute("data-appearoffset");
    if (appearOffset) {
      if (appearOffset.indexOf("vh") > -1) {
        appearOffset = Math.floor(
          window.innerHeight * (parseInt(appearOffset) / 100)
        );
      }
      appearOffset = parseInt(appearOffset, 10);
      if (window.pageYOffset >= appearOffset) {
        if (getComputedStyle(container, null).visibility === "hidden") {
          if (container.classList.contains("t654_top")) {
            container.style.top = "-50px";
            container.style.visibility = "visible";
            t654__fadeIn(container);
            t654__animate(container, "top");
          } else {
            container.style.bottom = "-50px";
            container.style.visibility = "visible";
            t654__fadeIn(container);
            t654__animate(container, "bottom");
          }
        }
      } else {
        container.style.visibility = "hidden";
      }
    }
  }
}

function t654_changebgopacitymenu(recId) {
  var rec = document.getElementById("rec" + recId);
  if (!rec) return;
  var container = rec.querySelector(".t654");
  if (!container) return;
  if (window.innerWidth > 980) {
    var bgColor = container.getAttribute("data-bgcolor-rgba");
    var bgColorAfterScroll = container.getAttribute(
      "data-bgcolor-rgba-afterscroll"
    );
    var bgOpacity = container.getAttribute("data-bgopacity");
    var bgOpacityTwo = container.getAttribute("data-bgopacity-two");
    var menuShadow = container.getAttribute("data-menushadow");
    var menuShadowValue = menuShadow;
    if (menuShadow !== "100") {
      menuShadowValue = "0." + menuShadow;
    }
    if (window.pageYOffset > 20) {
      container.style.backgroundColor = bgColorAfterScroll;
      if (bgOpacityTwo === "0" || menuShadow === " ") {
        container.style.boxShadow = "none";
      } else {
        container.style.boxShadow =
          "0px 1px 3px rgba(0, 0, 0, " + menuShadowValue + ")";
      }
    } else {
      container.style.backgroundColor = bgColor;
      if (bgOpacity === "0.0" || menuShadow === " ") {
        container.style.boxShadow = "none";
      } else {
        container.style.boxShadow =
          "0px 1px 3px rgba(0, 0, 0, " + menuShadowValue + ")";
      }
    }
  }
}

function t654__fadeIn(el) {
  if (el.style.display === "block") return;
  var opacity = 0;
  el.style.opacity = opacity;
  el.style.display = "block";
  var timer = setInterval(function () {
    el.style.opacity = opacity;
    opacity += 0.1;
    if (opacity >= 1.0) {
      clearInterval(timer);
      el.style.display = "";
    }
  }, 20);
}

function t654__animate(element, animate) {
  var duration = 200;
  var start = parseInt(getComputedStyle(element, null)[animate]);
  var change = 0 - start;
  var currentTime = 0;
  var increment = 16;

  function t654__easeInOutCubic(currentTime, start, change) {
    if ((currentTime /= duration / 2) < 1) {
      return (change / 2) * currentTime * currentTime * currentTime + start;
    } else {
      return (
        (change / 2) * ((currentTime -= 2) * currentTime * currentTime + 2) +
        start
      );
    }
  }

  function t654__animateScroll() {
    currentTime += increment;
    element.style[animate] =
      t654__easeInOutCubic(currentTime, start, change) + "px";
    if (currentTime < duration) {
      setTimeout(t654__animateScroll, increment);
    } else {
      element.style[animate] = "0px";
    }
  }
  t654__animateScroll();
}

function t509_setHeight(recId) {
  var rec = document.getElementById("rec" + recId);
  if (!rec) return;
  var container = rec.querySelector(".t509");
  if (!container) return;
  var images = rec.querySelectorAll(".t509__blockimg");
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imageWidth = image.getAttribute("data-image-width");
    var imageHeight = image.getAttribute("data-image-height");
    if (imageHeight.indexOf("vh") === -1) {
      imageHeight = parseInt(imageHeight, 10);
    } else {
      imageHeight = (parseInt(imageHeight, 10) / 100) * window.innerHeight;
    }
    var imageRatio = imageHeight / imageWidth;
    var imagePadding = imageRatio * 100;
    image.style.paddingBottom = imagePadding + "%";
  }
  if (window.innerWidth > 960) {
    var desktopImage = rec.querySelector(".t509__desktopimg");
    if (desktopImage) {
      var height = desktopImage.clientHeight;
      var textWrappers = rec.querySelectorAll(".t509__textwrapper");
      for (var i = 0; i < textWrappers.length; i++) {
        textWrappers[i].style.height = height + "px";
      }
    }
  }
}

function t657_init(recid) {
  var rec = document.querySelector("#rec" + recid);
  if (!rec) return;
  var wrapperBlock = rec.querySelector(".t657");
  var closeButton = rec.querySelector(".t657__btn");
  var closeIcon = rec.querySelector(".t657__icon-close");
  var storageItem = wrapperBlock.getAttribute("data-storage-item");
  var lastOpen;
  if (typeof localStorage === "object") {
    try {
      lastOpen = localStorage.getItem(storageItem);
    } catch (error) {
      console.log(
        "Your web browser does not support localStorage. Error status: ",
        error
      );
    }
  }
  if (!lastOpen) {
    wrapperBlock.classList.remove("t657_closed");
  }
  wrapperBlock.addEventListener("click", function (event) {
    if (event.target === closeButton || event.target === closeIcon) {
      wrapperBlock.classList.add("t657_closed");
      if (typeof localStorage === "object") {
        try {
          localStorage.setItem(storageItem, Math.floor(Date.now() / 1000));
        } catch (error) {
          console.log(
            "Your web browser does not support localStorage. Error status: ",
            error
          );
        }
      }
    }
    event.preventDefault();
  });
}

function t228__init(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menuBlock = rec.querySelector(".t228");
  var mobileMenu = rec.querySelector(".t228__mobile");
  var menuSubLinkItems = rec.querySelectorAll(".t-menusub__link-item");
  var rightBtn = rec.querySelector(".t228__right_buttons_but .t-btn");
  var mobileMenuPosition = mobileMenu
    ? mobileMenu.style.position || window.getComputedStyle(mobileMenu).position
    : "";
  var mobileMenuDisplay = mobileMenu
    ? mobileMenu.style.display || window.getComputedStyle(mobileMenu).display
    : "";
  var isFixedMobileMenu =
    mobileMenuPosition === "fixed" && mobileMenuDisplay === "block";
  var overflowEvent = document.createEvent("Event");
  var noOverflowEvent = document.createEvent("Event");
  overflowEvent.initEvent("overflow", !0, !0);
  noOverflowEvent.initEvent("nooverflow", !0, !0);
  if (menuBlock) {
    menuBlock.addEventListener("overflow", function () {
      t228_checkOverflow(recid);
    });
    menuBlock.addEventListener("nooverflow", function () {
      t228_checkNoOverflow(recid);
    });
  }
  rec.addEventListener("click", function (e) {
    var targetLink = e.target.closest(".t-menusub__target-link");
    if (targetLink && window.isMobile) {
      if (targetLink.classList.contains("t-menusub__target-link_active")) {
        if (menuBlock) menuBlock.dispatchEvent(overflowEvent);
      } else {
        if (menuBlock) menuBlock.dispatchEvent(noOverflowEvent);
      }
    }
    var currentLink = e.target.closest(
      ".t-menu__link-item:not(.tooltipstered):not(.t-menusub__target-link):not(.t794__tm-link):not(.t966__tm-link):not(.t978__tm-link):not(.t978__menu-link)"
    );
    if (currentLink && mobileMenu && isFixedMobileMenu) mobileMenu.click();
  });
  Array.prototype.forEach.call(menuSubLinkItems, function (linkItem) {
    linkItem.addEventListener("click", function () {
      if (mobileMenu && isFixedMobileMenu) mobileMenu.click();
    });
  });
  if (rightBtn) {
    rightBtn.addEventListener("click", function () {
      if (mobileMenu && isFixedMobileMenu) mobileMenu.click();
    });
  }
  if (menuBlock) {
    menuBlock.addEventListener("showME601a", function () {
      var menuLinks = rec.querySelectorAll(".t966__menu-link");
      Array.prototype.forEach.call(menuLinks, function (menuLink) {
        menuLink.addEventListener("click", function () {
          if (mobileMenu && isFixedMobileMenu) mobileMenu.click();
        });
      });
    });
  }
}

function t228_highlight() {
  var url = window.location.href;
  var pathname = window.location.pathname;
  if (url.substr(url.length - 1) === "/") {
    url = url.slice(0, -1);
  }
  if (pathname.substr(pathname.length - 1) === "/") {
    pathname = pathname.slice(0, -1);
  }
  if (pathname.charAt(0) === "/") {
    pathname = pathname.slice(1);
  }
  if (pathname === "") {
    pathname = "/";
  }
  var shouldBeActiveElements = document.querySelectorAll(
    ".t228__list_item a[href='" +
      url +
      "'], " +
      ".t228__list_item a[href='" +
      url +
      "/'], " +
      ".t228__list_item a[href='" +
      pathname +
      "'], " +
      ".t228__list_item a[href='/" +
      pathname +
      "'], " +
      ".t228__list_item a[href='" +
      pathname +
      "/'], " +
      ".t228__list_item a[href='/" +
      pathname +
      "/']"
  );
  Array.prototype.forEach.call(shouldBeActiveElements, function (link) {
    link.classList.add("t-active");
  });
}

function t228_checkAnchorLinks(recid) {
  if (window.innerWidth >= 980) {
    var rec = document.getElementById("rec" + recid);
    var navLinks = rec
      ? rec.querySelectorAll(".t228__list_item a[href*='#']")
      : [];
    navLinks = Array.prototype.filter.call(navLinks, function (navLink) {
      return !navLink.classList.contains("tooltipstered");
    });
    if (navLinks.length) {
      setTimeout(function () {
        t228_catchScroll(navLinks);
      }, 500);
    }
  }
}

function t228_checkOverflow(recid) {
  var rec = document.getElementById("rec" + recid);
  var menu = rec ? rec.querySelector(".t228") : null;
  if (!menu) return;
  var mobileContainer = document.querySelector(".t228__mobile_container");
  var mobileContainerHeight = t228_getFullHeight(mobileContainer);
  var windowHeight = document.documentElement.clientHeight;
  var menuPosition =
    menu.style.position || window.getComputedStyle(menu).position;
  if (menuPosition === "fixed") {
    menu.classList.add("t228__overflow");
    menu.style.setProperty(
      "height",
      windowHeight - mobileContainerHeight + "px",
      "important"
    );
  }
}

function t228_checkNoOverflow(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return !1;
  var menu = rec.querySelector(".t228");
  var menuPosition = menu
    ? menu.style.position || window.getComputedStyle(menu).position
    : "";
  if (menuPosition === "fixed") {
    if (menu) menu.classList.remove("t228__overflow");
    if (menu) menu.style.height = "auto";
  }
}

function t228_catchScroll(navLinks) {
  navLinks = Array.prototype.slice.call(navLinks);
  var clickedSectionID = null;
  var sections = [];
  var sectionToNavigationLinkID = {};
  var interval = 100;
  var lastCall;
  var timeoutID;
  navLinks = navLinks.reverse();
  navLinks.forEach(function (link) {
    var currentSection = t228_getSectionByHref(link);
    if (currentSection && currentSection.id) {
      sections.push(currentSection);
      sectionToNavigationLinkID[currentSection.id] = link;
    }
  });
  sections.sort(function (a, b) {
    return b.getBoundingClientRect().top - a.getBoundingClientRect().top;
  });
  t228_highlightNavLinks(
    navLinks,
    sections,
    sectionToNavigationLinkID,
    clickedSectionID
  );
  navLinks.forEach(function (navLink, i) {
    navLink.addEventListener("click", function () {
      var clickedSection = t228_getSectionByHref(navLink);
      if (
        !navLink.classList.contains("tooltipstered") &&
        clickedSection &&
        clickedSection.id
      ) {
        navLinks.forEach(function (link, index) {
          if (index === i) {
            link.classList.add("t-active");
          } else {
            link.classList.remove("t-active");
          }
        });
        clickedSectionID = clickedSection.id;
      }
    });
  });
  window.addEventListener("scroll", function () {
    var dateNow = new Date().getTime();
    if (lastCall && dateNow < lastCall + interval) {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(function () {
        lastCall = dateNow;
        clickedSectionID = t228_highlightNavLinks(
          navLinks,
          sections,
          sectionToNavigationLinkID,
          clickedSectionID
        );
      }, interval - (dateNow - lastCall));
    } else {
      lastCall = dateNow;
      clickedSectionID = t228_highlightNavLinks(
        navLinks,
        sections,
        sectionToNavigationLinkID,
        clickedSectionID
      );
    }
  });
}

function t228_getSectionByHref(curlink) {
  if (!curlink) return;
  var href = curlink.getAttribute("href");
  var curLinkValue = href ? href.replace(/\s+/g, "") : "";
  if (curLinkValue.indexOf("/") === 0) curLinkValue = curLinkValue.slice(1);
  if (href && curlink.matches('[href*="#rec"]')) {
    curLinkValue = curLinkValue.replace(/.*#/, "");
    return document.getElementById(curLinkValue);
  } else {
    var selector = href ? href.trim() : "";
    var slashIndex = selector.indexOf("#") !== -1 ? selector.indexOf("#") : !1;
    if (typeof slashIndex === "number") {
      selector = selector.slice(slashIndex + 1);
    } else {
      slashIndex = selector.indexOf("/") !== -1 ? selector.indexOf("/") : !1;
      if (typeof slashIndex === "number")
        selector = selector.slice(slashIndex + 1);
    }
    var fullSelector = '.r[data-record-type="215"] a[name="' + selector + '"]';
    return document.querySelector(fullSelector)
      ? document.querySelector(fullSelector).closest(".r")
      : null;
  }
}

function t228_highlightNavLinks(
  navLinks,
  sections,
  sectionToNavigationLinkID,
  clickedSectionID
) {
  var scrollPosition = window.pageYOffset;
  var scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  var returnValue = clickedSectionID;
  var lastSection = sections.length ? sections[sections.length - 1] : null;
  var lastSectionTopPos = lastSection
    ? lastSection.getAttribute("data-offset-top")
    : "0";
  lastSectionTopPos = parseInt(lastSectionTopPos, 10) || 0;
  if (
    sections.length &&
    clickedSectionID === null &&
    lastSectionTopPos > scrollPosition + 300
  ) {
    navLinks.forEach(function (link) {
      link.classList.remove("t-active");
    });
    return null;
  }
  for (var i = 0; i < sections.length; i++) {
    var sectionTopPos =
      sections[i].getBoundingClientRect().top + window.pageYOffset;
    var navLink = sections[i].id
      ? sectionToNavigationLinkID[sections[i].id]
      : null;
    if (
      scrollPosition + 300 >= sectionTopPos ||
      (i === 0 && scrollPosition >= scrollHeight - window.innerHeight)
    ) {
      if (
        clickedSectionID === null &&
        navLink &&
        !navLink.classList.contains("t-active")
      ) {
        navLinks.forEach(function (link) {
          link.classList.remove("t-active");
        });
        if (navLink) navLink.classList.add("t-active");
        returnValue = null;
      } else if (
        clickedSectionID !== null &&
        sections[i].id &&
        clickedSectionID === sections[i].id
      ) {
        returnValue = null;
      }
      break;
    }
  }
  return returnValue;
}

function t228_setWidth(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menuCenterSideList = rec.querySelectorAll(".t228__centerside");
  Array.prototype.forEach.call(menuCenterSideList, function (menuCenterSide) {
    menuCenterSide.classList.remove("t228__centerside_hidden");
  });
  if (window.innerWidth <= 980) return;
  var menuBlocks = rec.querySelectorAll(".t228");
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var maxWidth;
    var centerWidth = 0;
    var paddingWidth = 40;
    var leftSide = menu.querySelector(".t228__leftside");
    var rightSide = menu.querySelector(".t228__rightside");
    var menuList = menu.querySelector(".t228__list");
    var mainContainer = menu.querySelector(".t228__maincontainer");
    var leftContainer = menu.querySelector(".t228__leftcontainer");
    var rightContainer = menu.querySelector(".t228__rightcontainer");
    var centerContainer = menu.querySelector(".t228__centercontainer");
    var centerContainerLi = centerContainer
      ? centerContainer.querySelectorAll("li")
      : [];
    var leftContainerWidth = t228_getFullWidth(leftContainer);
    var rightContainerWidth = t228_getFullWidth(rightContainer);
    var mainContainerWidth = mainContainer ? mainContainer.offsetWidth : 0;
    var dataAlign = menu.getAttribute("data-menu-items-align");
    var isDataAlignCenter = dataAlign === "center" || dataAlign === null;
    maxWidth =
      leftContainerWidth >= rightContainerWidth
        ? leftContainerWidth
        : rightContainerWidth;
    maxWidth = Math.ceil(maxWidth);
    Array.prototype.forEach.call(centerContainerLi, function (li) {
      centerWidth += t228_getFullWidth(li);
    });
    if (
      mainContainerWidth - (maxWidth * 2 + paddingWidth * 2) >
      centerWidth + 20
    ) {
      if (isDataAlignCenter) {
        if (leftSide) leftSide.style.minWidth = maxWidth + "px";
        if (rightSide) rightSide.style.minWidth = maxWidth + "px";
        if (menuList) menuList.classList.remove("t228__list_hidden");
      }
    } else {
      if (leftSide) leftSide.style.minWidth = maxWidth + "";
      if (rightSide) rightSide.style.minWidth = maxWidth + "";
    }
  });
}

function t228_getFullWidth(el) {
  if (!el) return 0;
  var marginLeft =
    el.style.marginLeft || window.getComputedStyle(el).marginLeft;
  var marginRight =
    el.style.marginRight || window.getComputedStyle(el).marginRight;
  marginLeft = parseInt(marginLeft, 10) || 0;
  marginRight = parseInt(marginRight, 10) || 0;
  return el.offsetWidth + marginLeft + marginRight;
}

function t228_getFullHeight(el) {
  if (!el) return 0;
  var marginTop = el.style.marginTop || window.getComputedStyle(el).marginTop;
  var marginBottom =
    el.style.marginBottom || window.getComputedStyle(el).marginBottom;
  marginTop = parseInt(marginTop, 10) || 0;
  marginBottom = parseInt(marginBottom, 10) || 0;
  return el.offsetHeight + marginTop + marginBottom;
}

function t228_setBg(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menuBlocks = rec.querySelectorAll(".t228");
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    if (window.innerWidth > 980) {
      if (menu.getAttribute("data-bgcolor-setbyscript") === "yes") {
        menu.style.backgroundColor = menu.getAttribute("data-bgcolor-rgba");
      }
    } else {
      menu.style.backgroundColor = menu.getAttribute("data-bgcolor-hex");
      menu.setAttribute("data-bgcolor-setbyscript", "yes");
      if (menu.style.transform) menu.style.transform = "";
      if (menu.style.opacity) menu.style.opacity = "";
    }
  });
}

function t228_appearMenu(recid) {
  if (window.innerWidth <= 980) return;
  var rec = document.getElementById("rec" + recid);
  if (!rec) return !1;
  var menuBlocks = rec.querySelectorAll(".t228");
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var appearOffset = menu.getAttribute("data-appearoffset");
    if (appearOffset) {
      if (appearOffset.indexOf("vh") !== -1) {
        appearOffset = Math.floor(
          window.innerHeight * (parseInt(appearOffset) / 100)
        );
      }
      appearOffset = parseInt(appearOffset, 10);
      var menuHeight = menu.clientHeight;
      if (
        typeof appearOffset === "number" &&
        window.pageYOffset >= appearOffset
      ) {
        if (menu.style.transform === "translateY(-" + menuHeight + "px)") {
          t228_slideUpElement(menu, menuHeight, "toBottom");
        }
      } else if (menu.style.transform === "translateY(0px)") {
        t228_slideUpElement(menu, menuHeight, "toTop");
      } else {
        menu.style.transform = "translateY(-" + menuHeight + "px)";
        menu.style.opacity = "0";
      }
    }
  });
}

function t228_changebgopacitymenu(recid) {
  if (window.innerWidth <= 980) return;
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menuBlocks = rec.querySelectorAll(".t228");
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var bgColor = menu.getAttribute("data-bgcolor-rgba");
    var bgColorAfterScroll = menu.getAttribute("data-bgcolor-rgba-afterscroll");
    var bgOpacity = menu.getAttribute("data-bgopacity");
    var bgOpacityTwo = menu.getAttribute("data-bgopacity-two");
    var menuShadow = menu.getAttribute("data-menushadow") || "0";
    var menuShadowValue = menuShadow === "100" ? menuShadow : "0." + menuShadow;
    menu.style.backgroundColor =
      window.pageYOffset > 20 ? bgColorAfterScroll : bgColor;
    if (
      (window.pageYOffset > 20 && bgOpacityTwo === "0") ||
      (window.pageYOffset <= 20 && bgOpacity === "0.0") ||
      menuShadow === " "
    ) {
      menu.style.boxShadow = "none";
    } else {
      menu.style.boxShadow = "0px 1px 3px rgba(0,0,0," + menuShadowValue + ")";
    }
  });
}

function t228_createMobileMenu(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menu = rec.querySelector(".t228");
  var burger = rec.querySelector(".t228__mobile");
  if (burger) {
    burger.addEventListener("click", function () {
      if (burger.classList.contains("t228_opened")) {
        t228_fadeOut(menu, 300);
        burger.classList.remove("t228_opened");
      } else {
        t228_fadeIn(menu, 300, function () {
          if (menu.style.transform) menu.style.transform = "";
          if (menu.style.opacity) menu.style.opacity = "";
        });
        burger.classList.add("t228_opened");
      }
    });
  }
  window.addEventListener(
    "resize",
    t_throttle(function () {
      if (window.innerWidth > 980) {
        if (menu.style.opacity) menu.style.opacity = "";
        if (menu.style.display === "none") menu.style.display = "";
      } else if (menu.style.transform) menu.style.transform = "";
    })
  );
}

function t228_fadeOut(element, duration, callback) {
  if (!element) return !1;
  var opacity = 1;
  duration = parseInt(duration, 10);
  var speed = duration > 0 ? duration / 10 : 40;
  var timer = setInterval(function () {
    element.style.opacity = opacity;
    opacity -= 0.1;
    if (opacity <= 0.1) {
      element.style.opacity = "0";
      element.style.display = "none";
      if (typeof callback === "function") {
        callback();
      }
      clearInterval(timer);
    }
  }, speed);
}

function t228_fadeIn(element, duration, callback) {
  if (!element) return !1;
  if (
    (getComputedStyle(element).opacity === "1" ||
      getComputedStyle(element).opacity === "") &&
    getComputedStyle(element).display !== "none"
  )
    return !1;
  var opacity = 0;
  duration = parseInt(duration, 10);
  var speed = duration > 0 ? duration / 10 : 40;
  element.style.opacity = opacity;
  element.style.display = "block";
  var timer = setInterval(function () {
    element.style.opacity = opacity;
    opacity += 0.1;
    if (opacity >= 1) {
      element.style.opacity = "1";
      if (typeof callback === "function") {
        callback();
      }
      clearInterval(timer);
    }
  }, speed);
}

function t228_slideUpElement(menu, menuHeight, position) {
  var diff = position === "toTop" ? 0 : menuHeight;
  var diffOpacity = position === "toTop" ? 1 : 0;
  var timerID = setInterval(function () {
    menu.style.transform = "translateY(-" + diff + "px)";
    menu.style.opacity = diffOpacity.toString();
    diffOpacity = position === "toTop" ? diffOpacity - 0.1 : diffOpacity + 0.1;
    diff =
      position === "toTop" ? diff + menuHeight / 20 : diff - menuHeight / 20;
    if (position === "toTop" && diff >= menuHeight) {
      menu.style.transform = "translateY(-" + menuHeight + "px)";
      menu.style.opacity = "0";
      clearInterval(timerID);
    }
    if (position === "toBottom" && diff <= 0) {
      menu.style.transform = "translateY(0px)";
      menu.style.opacity = "1";
      clearInterval(timerID);
    }
  }, 10);
}

function t280_showMenu(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var isAndroid = /(android)/i.test(navigator.userAgent);
  var menu = rec.querySelector(".t280");
  var menuItems = rec.querySelectorAll(".t280__menu__item");
  var menuLinks = rec.querySelectorAll(".t978__menu-link");
  var menuContainer = rec.querySelector(".t280__menu");
  var clickElementsList = rec.querySelectorAll(
    ".t280__burger, .t280__menu__bg, .t280__menu__item:not(.tooltipstered):not(.t280__menu__item_submenu), .t978__tooltip-menu_mobile"
  );
  Array.prototype.forEach.call(clickElementsList, function (clickElement) {
    clickElement.addEventListener("click", function () {
      if (
        clickElement.closest(".t280__menu__item.tooltipstered") ||
        clickElement.closest(".t794__tm-link")
      )
        return;
      if (
        isChrome &&
        isAndroid &&
        menuItems.length > 10 &&
        window.location.hash
      ) {
        setTimeout(function () {
          var hash = window.location.hash;
          window.location.hash = "";
          window.location.hash = hash;
        }, 50);
      }
      if (!clickElement.closest(".t978__tm-link, .t966__tm-link")) {
        document.body.classList.toggle("t280_opened");
        if (menu) menu.classList.toggle("t280__main_opened");
        var menuHead = rec.querySelector(".t280__container");
        if (menuContainer)
          menuContainer.style.paddingTop =
            (menuHead ? menuHead.offsetHeight : 0) + "px";
      }
      t280_changeSize(recid);
      t280_highlight(recid);
    });
  });
  document.addEventListener("click", function (e) {
    if (
      e.target.closest(
        ".t978__tm-link, .t966__tm-link, .t-menusub__target-link"
      )
    ) {
      t280_changeSize(recid);
      if (menuContainer) menuContainer.style.transition = "none";
    }
  });
  Array.prototype.forEach.call(menuLinks, function (link) {
    link.addEventListener("click", function () {
      t280_changeSize(recid);
    });
  });
  if (menu) {
    menu.addEventListener("clickedAnchorInTooltipMenu", function () {
      document.body.classList.remove("t280_opened");
      menu.classList.remove("t280__main_opened");
    });
  }
  var submenuLinks = rec.querySelectorAll(".t-menusub__link-item");
  Array.prototype.forEach.call(submenuLinks, function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("t280_opened");
      if (menu) menu.classList.remove("t280__main_opened");
    });
  });
}

function t280_changeSize(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menu = rec.querySelector(".t280__menu");
  var menuBottom = rec.querySelector(".t280__bottom");
  var menuContainer = rec.querySelector(".t280__container");
  var menuWrapper = rec.querySelector(".t280__menu__wrapper");
  setTimeout(function () {
    var menuHeight = menu ? menu.offsetHeight : 0;
    var menuBottomHeight = menuBottom ? menuBottom.offsetHeight : 0;
    var menuContainerHeight = menuContainer ? menuContainer.offsetHeight : 0;
    var padding = 140;
    if (
      menuHeight >
      document.documentElement.clientHeight -
        (menuBottomHeight + menuContainerHeight + padding)
    ) {
      if (menuWrapper) menuWrapper.classList.add("t280__menu_static");
    } else {
      if (menuWrapper) menuWrapper.classList.remove("t280__menu_static");
    }
  });
}

function t280_changeBgOpacityMenu(recid) {
  var rec = document.getElementById("rec" + recid);
  if (!rec) return;
  var menuBlocks = rec.querySelectorAll(".t280__container__bg");
  Array.prototype.forEach.call(menuBlocks, function (menu) {
    var bgColor = menu.getAttribute("data-bgcolor-rgba");
    var bgColorAfterScroll = menu.getAttribute("data-bgcolor-rgba-afterscroll");
    var bgOpacity = menu.getAttribute("data-bgopacity");
    var bgOpacityTwo = menu.getAttribute("data-bgopacity2");
    var menuShadow = menu.getAttribute("data-menu-shadow") || "0";
    var menuShadowValue = menuShadow === "100" ? menuShadow : "0." + menuShadow;
    menu.style.backgroundColor =
      window.pageYOffset > 20 ? bgColorAfterScroll : bgColor;
    if (
      (window.pageYOffset > 20 && bgOpacityTwo === "0") ||
      (window.pageYOffset <= 20 && bgOpacity === "0.0") ||
      menuShadow === " "
    ) {
      menu.style.boxShadow = "none";
    } else {
      menu.style.boxShadow = "0px 1px 3px rgba(0,0,0," + menuShadowValue + ")";
    }
  });
}

function t280_appearMenu() {
  var menuBlocks = document.querySelectorAll(".t280");
  Array.prototype.forEach.call(menuBlocks, function (menuBlock) {
    var menu = menuBlock.querySelector(".t280__positionfixed");
    if (menu) {
      var appearOffset = menuBlock.getAttribute("data-appearoffset");
      if (appearOffset && appearOffset.indexOf("vh") !== -1) {
        appearOffset = Math.floor(
          window.innerHeight * (parseInt(appearOffset) / 100)
        );
      }
      appearOffset = parseInt(appearOffset, 10);
      var menuHeight = menu.clientHeight;
      if (
        typeof appearOffset === "number" &&
        window.pageYOffset >= appearOffset
      ) {
        if (menu.style.transform === "translateY(-" + menuHeight + "px)") {
          t280_slideUpElement(menu, menuHeight, "toBottom");
        }
      } else if (menu.style.transform === "translateY(0px)") {
        t280_slideUpElement(menu, menuHeight, "toTop");
      } else {
        menu.style.transform = "translateY(-" + menuHeight + "px)";
        menu.style.opacity = "0";
      }
    }
  });
}

function t280_slideUpElement(menu, menuHeight, direction) {
  var diff = direction === "toTop" ? 0 : menuHeight;
  var diffOpacity = direction === "toTop" ? 1 : 0;
  var timerID = setInterval(function () {
    menu.style.transform = "translateY(-" + diff + "px)";
    menu.style.opacity = diffOpacity.toString();
    diffOpacity = direction === "toTop" ? diffOpacity - 0.1 : diffOpacity + 0.1;
    diff =
      direction === "toTop" ? diff + menuHeight / 20 : diff - menuHeight / 20;
    if (direction === "toTop" && diff >= menuHeight) {
      menu.style.transform = "translateY(-" + menuHeight + "px)";
      menu.style.opacity = "0";
      clearInterval(timerID);
    }
    if (direction === "toBottom" && diff <= 0) {
      menu.style.transform = "translateY(0px)";
      menu.style.opacity = "1";
      clearInterval(timerID);
    }
  }, 10);
}

function t280_highlight(recid) {
  var url = window.location.href;
  var pathname = window.location.pathname;
  var hash = window.location.hash;
  if (url.substr(url.length - 1) === "/") {
    url = url.slice(0, -1);
  }
  if (pathname.substr(pathname.length - 1) === "/") {
    pathname = pathname.slice(0, -1);
  }
  if (pathname.charAt(0) === "/") {
    pathname = pathname.slice(1);
  }
  if (pathname === "") {
    pathname = "/";
  }
  var shouldBeActiveElements = document.querySelectorAll(
    ".t280__menu a[href='" +
      url +
      "'], " +
      ".t280__menu a[href='" +
      url +
      "/'], " +
      ".t280__menu a[href='" +
      pathname +
      "'], " +
      ".t280__menu a[href='/" +
      pathname +
      "'], " +
      ".t280__menu a[href='" +
      pathname +
      "/'], " +
      ".t280__menu a[href='/" +
      pathname +
      "/']" +
      (hash ? ", .t280__menu a[href='" + hash + "']" : "") +
      (hash ? ", .t280__menu a[href='/" + hash + "']" : "") +
      (hash ? ", .t280__menu a[href='" + hash + "/']" : "") +
      (hash ? ", .t280__menu a[href='/" + hash + "/']" : "")
  );
  var rec = document.getElementById("rec" + recid);
  var menuLinks = rec ? rec.querySelectorAll(".t280__menu a") : [];
  Array.prototype.forEach.call(menuLinks, function (link) {
    link.classList.remove("t-active");
  });
  Array.prototype.forEach.call(shouldBeActiveElements, function (link) {
    link.classList.add("t-active");
  });
}

function t704_onSuccess(form) {
  if (!(form instanceof Element)) form = form[0];
  var inputsWrapper = form.querySelector(".t-form__inputsbox");
  var inputsWrapperStyle = getComputedStyle(inputsWrapper, null);
  var inputsWrapperPaddingTop = parseInt(inputsWrapperStyle.paddingTop) || 0;
  var inputsWrapperPaddingBottom =
    parseInt(inputsWrapperStyle.paddingBottom) || 0;
  var inputsWrapperHeight =
    inputsWrapper.clientHeight -
    (inputsWrapperPaddingTop + inputsWrapperPaddingBottom);
  var inputsOffset =
    inputsWrapper.getBoundingClientRect().top + window.pageYOffset;
  var inputsBottom = inputsWrapperHeight + inputsOffset;
  var successBox = form.querySelector(".t-form__successbox");
  var successBoxOffset =
    successBox.getBoundingClientRect().top + window.pageYOffset;
  var target = 0;
  var windowHeight = window.innerHeight;
  var body = document.body;
  var html = document.documentElement;
  var documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  if (window.innerWidth > 960) {
    target = successBoxOffset - 200;
  } else {
    target = successBoxOffset - 100;
  }
  var tildaLabel = document.querySelector(".t-tildalabel");
  if (
    successBoxOffset > window.scrollY ||
    documentHeight - inputsBottom < windowHeight - 100
  ) {
    inputsWrapper.classList.add("t704__inputsbox_hidden");
    setTimeout(function () {
      if (windowHeight > documentHeight && tildaLabel) {
        t704__fadeOut(tildaLabel);
      }
    }, 300);
  } else {
    t704__scroll(target);
    setTimeout(function () {
      inputsWrapper.classList.add("t704__inputsbox_hidden");
    }, 400);
  }
  var successUrl = $(form).data("success-url");
  if (successUrl) {
    setTimeout(function () {
      window.location.href = successUrl;
    }, 500);
  }
}

function t704__fadeOut(el) {
  if (el.style.display === "none") return;
  var opacity = 1;
  var timer = setInterval(function () {
    el.style.opacity = opacity;
    opacity -= 0.1;
    if (opacity <= 0.1) {
      clearInterval(timer);
      el.style.display = "none";
      el.style.opacity = null;
    }
  }, 50);
}

function t704__scroll(target) {
  var duration = 400;
  var start =
    (window.pageYOffset || document.documentElement.scrollTop) -
    (document.documentElement.clientTop || 0);
  var change = target - start;
  var currentTime = 0;
  var increment = 16;
  document.body.setAttribute("data-scrollable", "true");

  function t704__easeInOutCubic(currentTime) {
    if ((currentTime /= duration / 2) < 1) {
      return (change / 2) * currentTime * currentTime * currentTime + start;
    } else {
      return (
        (change / 2) * ((currentTime -= 2) * currentTime * currentTime + 2) +
        start
      );
    }
  }

  function t704__animateScroll() {
    currentTime += increment;
    window.scrollTo(0, t704__easeInOutCubic(currentTime));
    if (currentTime < duration) {
      setTimeout(t704__animateScroll, increment);
    } else {
      document.body.removeAttribute("data-scrollable");
    }
  }
  t704__animateScroll();
}
