import { CardHoverEffectDemo } from "../Custom/AuthorsCard"
import { NavbarDemo } from "../Custom/NavBar"
import { SpotlightPreview } from "../Custom/SpotAuthorsHero"


const Authors = () => {
  return (
    <div>
      <NavbarDemo />
      
        <SpotlightPreview />
        <CardHoverEffectDemo />

    </div>
  )
}

export default Authors