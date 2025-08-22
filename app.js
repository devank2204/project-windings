
// INP-friendly converter with idle callback + debounce
(function(){
  const inputEl = document.getElementById('input');
  const outputEl = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const mapping = window.WINGDINGS_MAP || {};
  let pending = null;

  function translate(text){
    return text.split('').map(ch => mapping[ch] || ch).join('');
  }

  function schedule(){
    if (pending) cancelIdleCallback(pending);
    const val = inputEl ? inputEl.value : '';
    pending = requestIdleCallback(() => {
      if (outputEl) outputEl.value = translate(val);
    }, {timeout: 200});
  }

  if (inputEl){
    inputEl.addEventListener('input', schedule, {passive: true});
    schedule();
  }

  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(outputEl.value || '');
        copyBtn.innerText = 'Copied!';
        setTimeout(()=> copyBtn.innerText='Copy', 1500);
      }catch(e){ alert('Copy failed'); }
    });
  }

  if (downloadBtn){
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([outputEl.value || ''], {type:'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'wingdings.txt'; a.click();
      URL.revokeObjectURL(url);
    });
  }
})();
