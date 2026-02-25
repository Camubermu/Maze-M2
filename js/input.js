import { onMoveKey } from './game.js';

export function attachInput(){
  document.addEventListener('keydown', (e)=>{
    // bloqueamos desplazamiento/retroceso
    if (e.keyCode === 32 || e.keyCode === 8){
      e.preventDefault();
    }
    onMoveKey(e.keyCode);
  }, {passive:false});
}
