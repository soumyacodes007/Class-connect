"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";


const NavigationLogo = () => {
    const router = useRouter();
    return ( 
        <div>
            <Image
                onClick={() => router.push('/')}
                src={'/Classconnect.png'}
                alt = 'logo'
                width={48} 
                height={48} 
            />
        </div>
     );
}
 
export default NavigationLogo;