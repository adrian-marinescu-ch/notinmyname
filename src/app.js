
const body=document.body;
const progress=document.getElementById("progress");
const siteHeader=document.querySelector(".site-header");
const menuToggle=document.querySelector("[data-menu-toggle]");
const nav=document.querySelector("[data-nav]");
const toast=document.getElementById("toast");
const toastText=toast?.querySelector("span");
const LANG_SWITCH_SCROLL_KEY="lang-switch-instant-scroll";
const LANG_SWITCH_TARGET_KEY="lang-switch-target-hash";
const CONSENT_STORAGE_KEY="site-consent-v1";
const THEME_STORAGE_KEY="site-theme-v1";
const FONT_SCALE_STORAGE_KEY="site-font-scale-v1";
const MIN_FONT_SCALE=.8;
const MAX_FONT_SCALE=1.25;
const FONT_SCALE_STEP=.1;
const root=document.documentElement;
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const parseTheme=(value)=>["auto","light","dark"].includes(value)?value:"auto";
const parseFontScale=(value)=>{
  const numeric=Number(value);
  if(!Number.isFinite(numeric))return 1;
  return clamp(Math.round(numeric*100)/100,MIN_FONT_SCALE,MAX_FONT_SCALE);
};
let currentTheme="auto";
let currentFontScale=1;
const applyTheme=(theme)=>{
  if(theme==="auto")root.removeAttribute("data-theme");
  else root.setAttribute("data-theme",theme);
  document.querySelectorAll("[data-theme-set]").forEach((button)=>{
    const isActive=button.getAttribute("data-theme-set")===theme;
    button.setAttribute("aria-pressed",String(isActive));
  });
};
const applyFontScale=(scale)=>{
  root.style.fontSize=`${Math.round(scale*100)}%`;
  document.querySelectorAll("[data-font-size-value]").forEach((node)=>{
    const prefix=node.getAttribute("data-font-prefix")||"Text";
    node.textContent=`${prefix} ${Math.round(scale*100)}%`;
  });
};
const saveTheme=(theme)=>{
  try{
    localStorage.setItem(THEME_STORAGE_KEY,theme);
  }catch{}
};
const saveFontScale=(scale)=>{
  try{
    localStorage.setItem(FONT_SCALE_STORAGE_KEY,String(scale));
  }catch{}
};
try{
  currentTheme=parseTheme(localStorage.getItem(THEME_STORAGE_KEY)||"auto");
}catch{
  currentTheme="auto";
}
try{
  currentFontScale=parseFontScale(localStorage.getItem(FONT_SCALE_STORAGE_KEY)||"0.9");
}catch{
  currentFontScale=0.9;
}
applyTheme(currentTheme);
applyFontScale(currentFontScale);
document.querySelectorAll("[data-theme-set]").forEach((button)=>{
  button.addEventListener("click",()=>{
    const theme=parseTheme(button.getAttribute("data-theme-set")||"auto");
    currentTheme=theme;
    applyTheme(currentTheme);
    saveTheme(currentTheme);
  });
});
document.querySelectorAll("[data-font-size-inc]").forEach((button)=>button.addEventListener("click",()=>{
  currentFontScale=clamp(Math.round((currentFontScale+FONT_SCALE_STEP)*100)/100,MIN_FONT_SCALE,MAX_FONT_SCALE);
  applyFontScale(currentFontScale);
  saveFontScale(currentFontScale);
}));
document.querySelectorAll("[data-font-size-dec]").forEach((button)=>button.addEventListener("click",()=>{
  currentFontScale=clamp(Math.round((currentFontScale-FONT_SCALE_STEP)*100)/100,MIN_FONT_SCALE,MAX_FONT_SCALE);
  applyFontScale(currentFontScale);
  saveFontScale(currentFontScale);
}));
document.querySelectorAll("[data-font-size-reset]").forEach((button)=>button.addEventListener("click",()=>{
  currentFontScale=1;
  applyFontScale(currentFontScale);
  saveFontScale(currentFontScale);
}));
document.querySelectorAll("[data-toggle-a11y-panel]").forEach((button)=>{
  const hub=button.closest(".a11y-hub");
  const panel=hub?.querySelector("[data-a11y-panel]");
  if(!panel)return;
  button.addEventListener("click",()=>{
    const willOpen=panel.hidden;
    panel.hidden=!willOpen;
    button.setAttribute("aria-expanded",String(willOpen));
  });
});
const showToast=(message)=>{
  if(!toast||!toastText)return;
  toastText.textContent=message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=>toast.classList.remove("is-visible"),1800);
};
let trackUiInteraction=()=>{};
const trackedFormInteractionKeys=new Set();
const trackedFormNames=new Set(["fullName","city","county","email","phone","target"]);
document.addEventListener("click",(event)=>{
  const target=event.target;
  if(!(target instanceof Element))return;
  const navAnchor=target.closest(".main-nav a, .footer-links a, .breadcrumbs a");
  if(navAnchor){
    trackUiInteraction("navigation_click","menu");
    return;
  }
  if(target.closest("[data-copy-subject]")){
    trackUiInteraction("copy_subject_click","complaint_form");
    return;
  }
  if(target.closest("[data-copy-body]")){
    trackUiInteraction("copy_body_click","complaint_form");
    return;
  }
  if(target.closest("[data-open-email]")){
    trackUiInteraction("open_email_click","complaint_form");
    return;
  }
  if(target.closest("[data-copy-link]")){
    trackUiInteraction("copy_link_click","share");
    return;
  }
  if(target.closest("[data-copy-embed]")){
    trackUiInteraction("copy_embed_click","resources");
    return;
  }
  if(target.closest("[data-share]")){
    trackUiInteraction("share_click","share");
  }
});
document.addEventListener("input",(event)=>{
  const target=event.target;
  if(!(target instanceof HTMLInputElement||target instanceof HTMLSelectElement||target instanceof HTMLTextAreaElement))return;
  const form=target.closest("[data-complaint-form]");
  if(!form)return;
  const fieldName=target.getAttribute("name")||"";
  if(!trackedFormNames.has(fieldName))return;
  const key=`${fieldName}:${form.closest("[data-complaint-generator]")?.getAttribute("data-locale")||"default"}`;
  if(trackedFormInteractionKeys.has(key))return;
  if(target instanceof HTMLSelectElement || (target.value||"").trim()){
    trackedFormInteractionKeys.add(key);
    trackUiInteraction("complaint_field_interaction",fieldName);
  }
});
if(menuToggle&&nav){
  const closeMenu=()=>{
    menuToggle.setAttribute("aria-expanded","false");
    nav.classList.remove("is-open");
    body.classList.remove("nav-open");
  };
  menuToggle.addEventListener("click",()=>{
    const expanded=menuToggle.getAttribute("aria-expanded")==="true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
    body.classList.toggle("nav-open", !expanded);
  });
  nav.querySelectorAll("a").forEach((link)=>link.addEventListener("click",closeMenu));
  window.addEventListener("resize",()=>{if(window.innerWidth>780)closeMenu();});
}
if(progress){
  const updateProgress=()=>{
    const doc=document.documentElement;
    const max=doc.scrollHeight-window.innerHeight;
    const value=max>0?(window.scrollY/max)*100:0;
    progress.style.width=`${Math.min(100,Math.max(0,value))}%`;
  };
  updateProgress();
  window.addEventListener("scroll",updateProgress,{passive:true});
}
const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getHeaderOffset=()=>{
  const headerHeight=siteHeader?.getBoundingClientRect().height||0;
  return Math.ceil(headerHeight)-1;
};

const scrollToAnchorHash=(hash,{instant=false}={})=>{
  if(!hash||hash==="#")return false;
  const id=decodeURIComponent(hash.replace(/^#/,""));
  const target=document.getElementById(id);
  if(!target)return false;
  const top=Math.max(0,window.scrollY+target.getBoundingClientRect().top-getHeaderOffset());
  window.scrollTo({top,behavior:(prefersReduced||instant)?"auto":"smooth"});
  return true;
};

const getCurrentSectionHash=()=>{
  const sections=[...document.querySelectorAll("main section[id]")];
  if(!sections.length)return "";
  const anchorLine=getHeaderOffset()+8;
  let currentSection=sections[0];
  for(const section of sections){
    if(section.getBoundingClientRect().top<=anchorLine){
      currentSection=section;
      continue;
    }
    break;
  }
  const id=currentSection?.id;
  return id?`#${encodeURIComponent(id)}`:"";
};

const getActiveViewportSectionHash=()=>{
  const sections=[...document.querySelectorAll("main section[id]")];
  if(!sections.length)return "";
  const anchorLine=getHeaderOffset()+8;
  let activeHash="";
  for(const section of sections){
    if(section.getBoundingClientRect().top<=anchorLine){
      activeHash=`#${encodeURIComponent(section.id)}`;
      continue;
    }
    break;
  }
  return activeHash;
};

const syncUrlToActiveSection=()=>{
  const activeHash=getActiveViewportSectionHash();
  if(activeHash===window.location.hash)return;
  const nextUrl=`${window.location.pathname}${window.location.search}${activeHash}`;
  history.replaceState(null,"",nextUrl);
};

document.querySelectorAll(".lang-switch[href]").forEach((link)=>{
  link.addEventListener("click",(event)=>{
    const targetUrl=new URL(link.href,window.location.href);
    const sectionHash=window.location.hash||getCurrentSectionHash();
    targetUrl.search=window.location.search;
    targetUrl.hash="";
    event.preventDefault();
    try{
      sessionStorage.setItem(LANG_SWITCH_SCROLL_KEY,"1");
      sessionStorage.setItem(LANG_SWITCH_TARGET_KEY,sectionHash);
    }catch{}
    window.location.assign(targetUrl.toString());
  });
});

document.querySelectorAll("a[href]").forEach((link)=>{
  link.addEventListener("click",(event)=>{
    const url=new URL(link.href,window.location.href);
    if(url.origin!==window.location.origin)return;
    if(url.pathname!==window.location.pathname)return;
    if(!url.hash)return;
    const didScroll=scrollToAnchorHash(url.hash);
    if(!didScroll)return;
    event.preventDefault();
    history.pushState(null,"",url.hash);
  });
});

window.addEventListener("load",()=>{
  let instantScroll=false;
  let targetHash="";
  try{
    instantScroll=sessionStorage.getItem(LANG_SWITCH_SCROLL_KEY)==="1";
    targetHash=sessionStorage.getItem(LANG_SWITCH_TARGET_KEY)||"";
    if(instantScroll){
      sessionStorage.removeItem(LANG_SWITCH_SCROLL_KEY);
      sessionStorage.removeItem(LANG_SWITCH_TARGET_KEY);
    }
  }catch{}
  if(instantScroll&&targetHash){
    setTimeout(()=>{
      const didScroll=scrollToAnchorHash(targetHash,{instant:true});
      if(didScroll)history.replaceState(null,"",targetHash);
    },0);
    return;
  }
  if(window.location.hash){
    setTimeout(()=>scrollToAnchorHash(window.location.hash),0);
  }
},{once:true});

window.addEventListener("hashchange",()=>{
  scrollToAnchorHash(window.location.hash);
});

let hashSyncTicking=false;
const onScrollHashSync=()=>{
  if(hashSyncTicking)return;
  hashSyncTicking=true;
  window.requestAnimationFrame(()=>{
    syncUrlToActiveSection();
    hashSyncTicking=false;
  });
};
window.addEventListener("scroll",onScrollHashSync,{passive:true});
window.addEventListener("resize",onScrollHashSync,{passive:true});
window.addEventListener("load",syncUrlToActiveSection,{once:true});

if(!prefersReduced && "IntersectionObserver" in window){
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  document.querySelectorAll("[data-reveal]").forEach((node)=>observer.observe(node));
}else{
  document.querySelectorAll("[data-reveal]").forEach((node)=>node.classList.add("is-visible"));
}
document.querySelectorAll("[data-copy-link]").forEach((button)=>{
  button.addEventListener("click", async ()=>{
    const copiedLabel=button.getAttribute("data-copied-label")||"Link copied.";
    try{
      await navigator.clipboard.writeText(window.location.href);
      showToast(copiedLabel);
    }catch{
      const input=document.createElement("input");
      input.value=window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      showToast(copiedLabel);
    }
  });
});
document.querySelectorAll("[data-copy-embed]").forEach((button)=>{
  button.addEventListener("click", async ()=>{
    const copiedLabel=button.getAttribute("data-copied-label")||"Copied.";
    const targetId=button.getAttribute("data-copy-target")||"";
    const field=targetId?document.getElementById(targetId):null;
    if(!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement))return;
    const value=field.value||"";
    if(!value)return;
    try{
      await navigator.clipboard.writeText(value);
      showToast(copiedLabel);
    }catch{
      field.focus();
      field.select();
      document.execCommand("copy");
      field.setSelectionRange(0,0);
      showToast(copiedLabel);
    }
  });
});
document.querySelectorAll("[data-share]").forEach((button)=>{
  button.addEventListener("click", async ()=>{
    const title=button.getAttribute("data-share-title")||document.title;
    const text=button.getAttribute("data-share-text")||"";
    const url=window.location.href;
    if(navigator.share){
      try{await navigator.share({title,text,url});}catch{}
      return;
    }
    try{
      await navigator.clipboard.writeText(url);
      showToast(button.getAttribute("data-copied-label")||"Link copied.");
    }catch{}
  });
});

const consentRoot=document.querySelector("[data-consent]");
if(consentRoot){
  const banner=consentRoot.querySelector("[data-consent-banner]");
  const panel=consentRoot.querySelector("[data-consent-panel]");
  const btnAcceptAll=consentRoot.querySelector("[data-consent-accept-all]");
  const btnReject=consentRoot.querySelector("[data-consent-reject]");
  const btnOpenPanel=consentRoot.querySelector("[data-consent-open-panel]");
  const btnSave=consentRoot.querySelector("[data-consent-save]");
  const btnClose=consentRoot.querySelector("[data-consent-close]");
  const inputAnalytics=consentRoot.querySelector("[data-consent-analytics]");
  const inputInteractions=consentRoot.querySelector("[data-consent-interactions]");
  const pageInteractionInputs=[...document.querySelectorAll("[data-consent-interactions-page]")];
  const openSettingsButtons=[...document.querySelectorAll("[data-open-consent-settings],[data-toggle-consent-panel]")];
  const toggleSettingsButtons=[...document.querySelectorAll("[data-toggle-consent-panel]")];
  const hasAnalyticsOption=Boolean(inputAnalytics);
  const hasInteractionOption=Boolean(inputInteractions||pageInteractionInputs.length);
  let applyOptionalTracking=()=>{};
  let currentConsentState={essential:true,analytics:false,interactions:false};

  const parseStoredConsent=()=>{
    try{
      const raw=localStorage.getItem(CONSENT_STORAGE_KEY);
      if(!raw)return null;
      const parsed=JSON.parse(raw);
      if(!parsed||typeof parsed!=="object")return null;
      return {
        essential:true,
        analytics:Boolean(parsed.analytics)&&hasAnalyticsOption,
        interactions:Boolean(parsed.interactions)&&hasInteractionOption,
      };
    }catch{
      return null;
    }
  };

  const persistConsent=(consent)=>{
    try{
      localStorage.setItem(CONSENT_STORAGE_KEY,JSON.stringify({
        version:1,
        essential:true,
        analytics:Boolean(consent.analytics),
        interactions:Boolean(consent.interactions),
        ts:new Date().toISOString(),
      }));
    }catch{}
  };
  const syncInteractionInputs=(consent)=>{
    if(inputInteractions){
      inputInteractions.checked=Boolean(consent.interactions);
      inputInteractions.disabled=!Boolean(consent.analytics);
    }
    pageInteractionInputs.forEach((input)=>{
      input.checked=Boolean(consent.interactions);
      input.disabled=!Boolean(consent.analytics);
    });
  };

  const setBannerVisible=(visible)=>{
    if(!banner)return;
    banner.hidden=!visible;
  };

  const setPanelVisible=(visible)=>{
    if(!panel)return;
    panel.hidden=!visible;
    toggleSettingsButtons.forEach((button)=>button.setAttribute("aria-expanded",String(visible)));
  };

  /*__GA_RUNTIME_START__*/
  const analyticsEnabled=consentRoot.getAttribute("data-analytics-enabled")==="true";
  const analyticsId=(consentRoot.getAttribute("data-analytics-id")||"").trim();
  let gaInitialized=false;
  let gaInitPromise=null;
  let interactionTrackingEnabled=false;
  const ensureGtag=()=>{
    if(!analyticsEnabled||!analyticsId)return Promise.resolve(false);
    if(gaInitialized&&typeof window.gtag==="function")return Promise.resolve(true);
    if(gaInitPromise)return gaInitPromise;
    gaInitPromise=new Promise((resolve)=>{
      window.dataLayer=window.dataLayer||[];
      window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
      window.gtag("consent","default",{analytics_storage:"denied"});
      window.gtag("config",analyticsId,{
        send_page_view:false,
        anonymize_ip:true,
        allow_google_signals:false,
        allow_ad_personalization_signals:false,
      });
      const script=document.createElement("script");
      script.async=true;
      script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
      script.onload=()=>{
        gaInitialized=true;
        window.gtag("js",new Date());
        resolve(true);
      };
      script.onerror=()=>resolve(false);
      document.head.appendChild(script);
    });
    return gaInitPromise;
  };
  const sendPageView=()=>{
    if(typeof window.gtag!=="function")return;
    window.gtag("event","page_view",{
      page_title:document.title,
      page_location:window.location.href,
      page_path:`${window.location.pathname}${window.location.search}${window.location.hash}`,
    });
  };
  const sendUiInteraction=(action,context)=>{
    if(!interactionTrackingEnabled||typeof window.gtag!=="function")return;
    window.gtag("event","ui_interaction",{
      event_category:"engagement",
      interaction_action:action,
      interaction_context:context,
      page_path:`${window.location.pathname}${window.location.search}${window.location.hash}`,
    });
  };
  trackUiInteraction=(action,context)=>sendUiInteraction(action,context);
  applyOptionalTracking=async(consent)=>{
    if(!analyticsEnabled||!analyticsId)return;
    interactionTrackingEnabled=false;
    if(!consent.analytics){
      window[`ga-disable-${analyticsId}`]=true;
      if(typeof window.gtag==="function"){
        window.gtag("consent","update",{analytics_storage:"denied"});
      }
      return;
    }
    const ready=await ensureGtag();
    if(!ready)return;
    window[`ga-disable-${analyticsId}`]=false;
    window.gtag("consent","update",{analytics_storage:"granted"});
    sendPageView();
    interactionTrackingEnabled=Boolean(consent.interactions);
  };
  /*__GA_RUNTIME_END__*/

  const applyConsent=(consent)=>{
    applyOptionalTracking(consent);
  };

  const commitConsent=(consent)=>{
    const normalized={
      essential:true,
      analytics:Boolean(consent.analytics)&&hasAnalyticsOption,
      interactions:Boolean(consent.interactions)&&Boolean(consent.analytics)&&hasInteractionOption,
    };
    currentConsentState=normalized;
    if(inputAnalytics)inputAnalytics.checked=normalized.analytics;
    syncInteractionInputs(normalized);
    persistConsent(normalized);
    setBannerVisible(false);
    setPanelVisible(false);
    applyConsent(normalized);
  };

  btnAcceptAll?.addEventListener("click",()=>{
    commitConsent({
      essential:true,
      analytics:hasAnalyticsOption,
      interactions:hasInteractionOption,
    });
  });

  btnReject?.addEventListener("click",()=>{
    commitConsent({essential:true,analytics:false,interactions:false});
  });

  btnOpenPanel?.addEventListener("click",()=>{
    setPanelVisible(true);
  });

  btnSave?.addEventListener("click",()=>{
    commitConsent({
      essential:true,
      analytics:Boolean(inputAnalytics?.checked)&&hasAnalyticsOption,
      interactions:Boolean(inputInteractions?.checked)&&hasInteractionOption,
    });
  });
  inputAnalytics?.addEventListener("change",()=>{
    if(!inputAnalytics.checked){
      if(inputInteractions)inputInteractions.checked=false;
      pageInteractionInputs.forEach((input)=>{input.checked=false;});
    }
    syncInteractionInputs({
      ...currentConsentState,
      analytics:Boolean(inputAnalytics.checked),
      interactions:Boolean(inputInteractions?.checked)&&Boolean(inputAnalytics.checked),
    });
  });
  pageInteractionInputs.forEach((input)=>input.addEventListener("change",()=>{
    const wantsInteractions=Boolean(input.checked);
    commitConsent({
      essential:true,
      analytics:wantsInteractions ? hasAnalyticsOption : currentConsentState.analytics,
      interactions:wantsInteractions,
    });
  }));

  btnClose?.addEventListener("click",()=>{
    setPanelVisible(false);
  });
  panel?.addEventListener("click",(event)=>{
    if(event.target===panel)setPanelVisible(false);
  });
  window.addEventListener("keydown",(event)=>{
    if(event.key==="Escape"&&!panel?.hidden)setPanelVisible(false);
  });

  openSettingsButtons.forEach((button)=>button.addEventListener("click",()=>{
    const isToggleButton=button.hasAttribute("data-toggle-consent-panel");
    if(isToggleButton){
      const nextVisible=panel?.hidden;
      setPanelVisible(Boolean(nextVisible));
      if(nextVisible)setBannerVisible(false);
      return;
    }
    setPanelVisible(true);
    setBannerVisible(false);
  }));

  const storedConsent=parseStoredConsent();
  if(storedConsent){
    currentConsentState={
      essential:true,
      analytics:Boolean(storedConsent.analytics),
      interactions:Boolean(storedConsent.interactions),
    };
    if(inputAnalytics)inputAnalytics.checked=currentConsentState.analytics;
    syncInteractionInputs(currentConsentState);
    applyConsent(currentConsentState);
  }else{
    if(inputAnalytics)inputAnalytics.checked=false;
    syncInteractionInputs(currentConsentState);
    setBannerVisible(true);
  }
}

if(typeof initComplaintForms==="function"){
  initComplaintForms({showToast});
}
