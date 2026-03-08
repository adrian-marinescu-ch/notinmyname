const normalizeField=(value="")=>String(value).replace(/\s+/g," ").trim();
const normalizeRecipients=(value="")=>String(value).split(",").map((item)=>item.trim()).filter(Boolean).join(",");
const formatDate=(lang)=>new Intl.DateTimeFormat(lang==="ro"?"ro-RO":"en-GB",{year:"numeric",month:"long",day:"numeric"}).format(new Date());

const buildRomanianTemplate=(salutation,subject)=>(profile,websiteUrl)=>{
  const text=`Data: ${formatDate("ro")}

${salutation}

Subsemnatul/Subsemnata ${profile.fullName}, din ${profile.city}, județul ${profile.county}, vă scriu pentru a cere reguli mai clare pentru creditele online.

Solicit sprijinul dumneavoastră pentru:
- verificarea clară a identității înainte de acordarea creditului;
- fără disbursare înainte de finalizarea verificărilor;
- oprirea temporară a executării când există o sesizare motivată de fraudă de identitate;
- fără executare pentru contractele acordate fără verificări minime.

Această schimbare nu blochează creditele online. Doar protejează oamenii nevinovați de abuzuri.

Mai multe informații: ${websiteUrl}

Date de contact:
- Nume: ${profile.fullName}
- Oraș: ${profile.city}
- Județ: ${profile.county}
- Email: ${profile.email}
- Telefon: ${profile.phone}

Vă rog să confirmați primirea și să îmi comunicați ce pași considerați utili mai departe.

Cu stimă,
${profile.fullName}`;
  return { subject, text };
};

const complaintTemplates={
  parliamentarians:buildRomanianTemplate(
    "Stimată doamnă / Stimate domn Parlamentar,",
    "Petiție: fără identitate verificată, fără credit executoriu"
  ),
  senators:buildRomanianTemplate(
    "Stimată doamnă / Stimate domn Senator,",
    "Petiție către Senat: protecție reală împotriva fraudei de identitate"
  ),
  deputies:buildRomanianTemplate(
    "Stimată doamnă / Stimate domn Deputat,",
    "Petiție către Camera Deputaților: verificare robustă a identității la creditele online"
  ),
  meps:(profile,websiteUrl)=>{
    const text=`Date: ${formatDate("en")}

Dear Member of the European Parliament,

My name is ${profile.fullName}, writing from ${profile.city}, ${profile.county}, Romania. I am asking for your support for stronger safeguards against identity fraud in online lending.

I respectfully ask for:
- clear identity verification before loan disbursement;
- temporary suspension of enforcement while identity-fraud complaints are being checked;
- no enforceability for contracts granted without minimum safeguards.

This does not seek to block digital lending. It seeks fair rules so stolen data cannot create enforceable debt against innocent people.

Campaign website: ${websiteUrl}

Contact details:
- Full name: ${profile.fullName}
- City: ${profile.city}
- County: ${profile.county}
- Email: ${profile.email}
- Phone: ${profile.phone}

Thank you for your time and for any support you can provide.

Best regards,
${profile.fullName}`;
    return{
      subject:"Request for support: identity-fraud safeguards in remote lending",
      text
    };
  }
};

const copyText=async (text,copiedLabel,showToast)=>{
  if(!text)return;
  try{
    await navigator.clipboard.writeText(text);
    if(typeof showToast==="function")showToast(copiedLabel);
  }catch{
    const input=document.createElement("textarea");
    input.value=text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    if(typeof showToast==="function")showToast(copiedLabel);
  }
};

const initComplaintForms=({showToast}={})=>{
  document.querySelectorAll("[data-complaint-generator]").forEach((node)=>{
    const form=node.querySelector("[data-complaint-form]");
    if(!form)return;

    const websiteUrl=node.getAttribute("data-website-url")||window.location.href;
    const locale=node.getAttribute("data-locale")==="ro"?"ro":"en";
    const previewPlaceholders=locale==="ro"
      ?{
        fullName:"[Nume Prenume]",
        city:"[Oras]",
        county:"[Judet]",
        email:"[Email]",
        phone:"[Telefon]"
      }
      :{
        fullName:"[Name]",
        city:"[City]",
        county:"[County]",
        email:"[Email]",
        phone:"[Phone]"
      };

    const targetSelect=form.querySelector("[data-target-group]");
    const recipientsInput=form.querySelector("[data-target-emails]");
    const subjectOutput=node.querySelector("[data-generated-subject]");
    const bodyOutput=node.querySelector("[data-generated-body]");
    const copySubjectButton=node.querySelector("[data-copy-subject]");
    const copyBodyButton=node.querySelector("[data-copy-body]");
    const openEmailButton=node.querySelector("[data-open-email]");
    const copiedLabel=node.getAttribute("data-copied-label")||"Copied.";
    if(!targetSelect||!subjectOutput||!bodyOutput||!copySubjectButton||!copyBodyButton||!openEmailButton)return;

    const setReadyState=(emailEnabled)=>{
      copySubjectButton.disabled=false;
      copyBodyButton.disabled=false;
      openEmailButton.disabled=!emailEnabled;
    };

    const updatePreview=()=>{
      const rawProfile={
        fullName:normalizeField(form.elements.fullName?.value),
        city:normalizeField(form.elements.city?.value),
        county:normalizeField(form.elements.county?.value),
        email:normalizeField(form.elements.email?.value),
        phone:normalizeField(form.elements.phone?.value),
      };
      const hasRequired=Object.values(rawProfile).every(Boolean) && (form.elements.email?.checkValidity?.() ?? true);
      const profile={
        fullName:rawProfile.fullName||previewPlaceholders.fullName,
        city:rawProfile.city||previewPlaceholders.city,
        county:rawProfile.county||previewPlaceholders.county,
        email:rawProfile.email||previewPlaceholders.email,
        phone:rawProfile.phone||previewPlaceholders.phone,
      };
      const templateBuilder=complaintTemplates[targetSelect.value];
      if(!templateBuilder){
        subjectOutput.value="";
        bodyOutput.value="";
        setReadyState(false);
        return;
      }
      const output=templateBuilder(profile,websiteUrl);
      subjectOutput.value=output.subject;
      bodyOutput.value=output.text;
      setReadyState(hasRequired);
    };

    form.addEventListener("input",updatePreview);
    form.addEventListener("change",updatePreview);
    updatePreview();

    copySubjectButton.addEventListener("click",()=>copyText(subjectOutput.value,copiedLabel,showToast));
    copyBodyButton.addEventListener("click",()=>copyText(bodyOutput.value,copiedLabel,showToast));
    openEmailButton.addEventListener("click",()=>{
      if(!subjectOutput.value||!bodyOutput.value)return;
      const recipients=normalizeRecipients(recipientsInput?.value);
      const query=`subject=${encodeURIComponent(subjectOutput.value)}&body=${encodeURIComponent(bodyOutput.value)}`;
      window.location.href=`mailto:${recipients}?${query}`;
    });
  });
};
