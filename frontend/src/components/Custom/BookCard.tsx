

import { DirectionAwareHover } from "../ui/direction-aware-hover";

export function DirectionAwareHoverDemo({imageUrl,pages,languages,title , rating} : any) {
 
    
  return ( 
    <div className="h-[40rem] relative  flex items-center justify-center m-3">
      <DirectionAwareHover imageUrl={imageUrl}>
        <p className="font-bold text-xl">{title}</p>
        <p className="font-normal text-sm">{pages} pages / {languages} / {rating}</p>
      </DirectionAwareHover>
    </div>
  );
}
