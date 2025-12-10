
// import ImageUploader from "@/components/ImageUploader";
// import Image from "next/image";

import { MyButton } from "@/components/Button";

import Logo from "@/components/Logo";
import Option from "@/components/Option";
import { Heading_2 } from "@/components/Text_Style/Heading_2";

export default function Home() {
  return (
    <div className="max-w-[440px] max-h-[880px] bg-white flex flex-col gap-5 items-center py-4 mt-14 px-5">

{/* <Logo/>
<Heading_2 value="Discover your perfect look with AI-powered hairstyle transformations. Try on new styles, colors, and cuts virtually." textColor="text-grayColor" className="text-center"/>

<MyButton value="Try Now" variant="default"/>
<MyButton value="Sign Up/Log In" variant="outline" className="border border-primaryColor text-primaryColor hover:text-primaryColor"/> */}

<Option/>


      {/* <Form/>

      <ImageUploader /> */}
    </div>
  );
}
