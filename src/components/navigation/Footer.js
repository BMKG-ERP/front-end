'use client';

import { IonIcon } from '@ionic/react';
import {
  logoWhatsapp,
  logoInstagram,
  logoLinkedin,
  mailOutline,
} from 'ionicons/icons';

const socialLinks = [
  {
    href: 'https://api.whatsapp.com/send?phone=6285743309417',
    icon: logoWhatsapp,
    label: 'Whatsapp',
  },
  { href: 'mailto:elhamalhaq@gmail.com', icon: mailOutline, label: 'Email' },
  {
    href: 'https://www.linkedin.com/in/alhaqz/',
    icon: logoLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://www.instagram.com/alhaqz',
    icon: logoInstagram,
    label: 'Instagram',
  },
];

function Footer() {
  return (
    <footer className="bg-[#191919] w-full py-8 px-4 lg:px-24 xl:px-20 flex flex-col items-center text-gray-100 text-sm md:text-lg">
      <h1 className="font-semibold">Copyright © 2025. All Rights Reserved.</h1>

      <div className="flex gap-4 mt-5">
        {socialLinks.map(({ href, icon, label }, index) => (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <IonIcon className="w-5 h-5" icon={icon} />
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
