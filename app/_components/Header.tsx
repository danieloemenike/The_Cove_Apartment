import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-black py-1 px-8 sticky top-0 z-50 h-16 flex items-center">
      <div className="container mx-auto">
        <Link href="/">
          
            <Image
              src="/TheCove.jpg"
              alt="The Cove Logo"
              width={50}
              height={20}
              className="cursor-pointer"
            />
          
        </Link>
      </div>
    </header>
  );
};

export default Header;
