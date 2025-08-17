"use client"
import React, { useState } from 'react';

import Image from 'next/image';
import { TheCoveMenu as skyMenu } from '@/Menu';
import { kitchenMenu } from '@/Kitchen-Menu';

type MenuItem = {
  id: number;
  name: string;
  image: string;
  price: string;
};

type MenuCategory = {
  id: number;
  category: string;
  items: MenuItem[];
};

const combinedMenu: MenuCategory[] = [
    ...skyMenu.map(c => ({ ...c, items: c.drinks })), 
    ...kitchenMenu.map(c => ({ ...c, items: c.food, id: c.id + skyMenu.length }))
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const menuData = combinedMenu;

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value === '' ? null : event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  
  return (
    <>
      <section className='w-full h-full flex  mt-4 py-10'>
        <div className='w-full h-full'>
          <div className='flex justify-center text-[1rem] md:text-[3rem] w-full h-full items-center px-2'>
            <h2 className='font-bold text-[2rem] lg:text-[4rem] font-gv bg-clip-text text-transparent bg-gradient-to-r  from-[#ff3c00] via-white  to-white'> Menu </h2>
          </div>
          <div className='w-full h-full'>
            <div className="flex flex-col md:flex-row justify-center m-4 p-4 gap-2 md:gap-4">
              <select title="categories" onChange={handleCategoryChange} className='mt-4 p-2  bg-black rounded-md '>
                <option value='' className=''>All Foods & Drinks</option>
                {menuData.map((item: MenuCategory) => (
                  <option key={item.id} value={item.category}>
                    {item.category}
                  </option>
                ))}
              </select>
              <input
                type='text'
                placeholder={`Search for items here...`}
                value={searchTerm}
                onChange={handleSearchChange}
                className='mt-4 p-2 rounded-md bg-black w-[100%] lg:w-[40%]'
              />
            </div>
            {menuData.map((item: MenuCategory) => {
              const items = (item.items || []).filter(
                (menuItem: MenuItem) =>
                  (!searchTerm || menuItem.name.toLowerCase().includes(searchTerm)) ||
                  (!searchTerm || menuItem.price.toLowerCase().includes(searchTerm))
              );

              if (!selectedCategory || (selectedCategory && item.category === selectedCategory && items.length > 0)) {
                return (
                  <div key={item.id} id={item.category.toLowerCase().replace(/\s+/g, '-')}>
                    {items.length > 0 && <div className='  flex decoration-from-font justify-center'> <h3 className='font-bold text-[3rem] text-center mt-32 mb-12 font-gv capitalize tracking-[.20rem] bg-clip-text text-transparent bg-gradient-to-r  to-white  from-[#ff3c00] '>{item.category}</h3> </div>}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:mx-3 md:gap-6 mx-2 lg:mx-20 backdrop-filter backdrop-blur-lg'>
                      {items.map((menuItem: MenuItem) => (
                        <div key={menuItem.id} id={menuItem.id.toString()} className='rounded-md h-80 w-50 p-2 shadow   backdrop-filter backdrop-blur-lg '>
                          <div className='h-60 w-full bg-white object-contain flex items-center justify-center overflow-hidden rounded-t-lg mb-2'>
                            <Image src={ menuItem.image } alt={menuItem.name} width={ 290 } height={ 150} className='object-contain rounded-xl' loading='lazy'/>
                          </div>
                          <div className='w-full flex justify-center items-center  h-[17%] mb-4 py-8 px-3 border border-black drop-shadow-2xl rounded-xl'>
                            <h2 className=' text-base font-semibold text-[#f8dcd3]'> <span className='bg-clip-text '>{ menuItem.name } : </span><span className='rounded-md text-sm text-white p-1 font-semibold'>₦{ menuItem.price}</span></h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
            {menuData
              .flatMap((item: MenuCategory) => item.items || [])
              .filter(
                (menuItem: MenuItem) =>
                  (!searchTerm || menuItem.name.toLowerCase().includes(searchTerm)) ||
                  (!searchTerm || menuItem.price.toLowerCase().includes(searchTerm))
              ).length === 0 && <div className='text-center col-span-5 h-60 w-full flex flex-col justify-center items-center text-2xl font-semibold my-36 gap-4'>
                  <>
                    <Image src="/undraw.svg" alt="missing" width={ 250 } height={ 250 } />
                    <h2> No items found </h2>
                  </>
                 </div> }
          </div>
        </div>
      </section>
    </>
  );

}
