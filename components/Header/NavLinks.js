import Link from "next/link";

const navLinks = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

const NavLinks = ({ className = "" }) => (
  <div className={`${className} flex flex-col space-y-2 py-4 lg:flex-row lg:space-y-0 lg:justify-center lg:gap-x-8 xl:gap-x-12 lg:items-center lg:py-0`}>
    {navLinks.map((link) => (
      <Link 
        href={link.href} 
        key={link.href} 
        className="link link-hover text-sm font-medium text-base-content py-2" 
        title={link.label}
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default NavLinks;