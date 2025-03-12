'use client';

import { IonIcon } from '@ionic/react';
import {
  logoWhatsapp,
  logoInstagram,
  logoLinkedin,
  mailOutline,
} from 'ionicons/icons';

function Footer() {
  return (
    <div className="bg-[#191919] w-full h-full">
      <div className="min-w-screen  flex flex-col items-center py-8 md:px-4 px-auto mx-auto lg:px-24 xl:px-20  w-11/12 xl:w-3/4">
        <div className="text-gray-100 md:text-lg text-[12px] flex flex-col items-center md:flex-row w-full">
          <div className="flex">
            <h1 className="flex-2 font-semibold">
              Copyright © 2023. All Rights Reserved.{' '}
            </h1>
          </div>
          <div className="flex-1 font-semibold mt-5 md:flex md:flex-row items-center justify-end flex  ">
            <h2 className="mx-2">
              <a
                href="https://api.whatsapp.com/send?phone=6285743309417"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                <IonIcon
                  className="w-5 h-5 md hydrated"
                  icon={logoWhatsapp}
                  role="img"
                  aria-label="logo Whatsapp"
                ></IonIcon>
              </a>
            </h2>
            <h2 className="mx-2">
              <a
                href={`mailto:elhamalhaq@gmail.com`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                <IonIcon
                  className="w-5 h-5 md hydrated"
                  icon={mailOutline}
                  role="img"
                  aria-label="logo Email"
                ></IonIcon>
              </a>
            </h2>
            <h2 className="mx-2">
              <a
                href="https://www.linkedin.com/in/alhaqz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                <IonIcon
                  className="w-5 h-5 md hydrated"
                  icon={logoLinkedin}
                  role="img"
                  aria-label="logo Linkedin"
                ></IonIcon>
              </a>
            </h2>

            <h2 className="mx-2">
              <a
                href="https:///www.instagram.com/alhaqz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IonIcon
                  className="w-5 h-5 md hydrated"
                  icon={logoInstagram}
                  role="img"
                  aria-label="logo Instagram"
                ></IonIcon>
              </a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
