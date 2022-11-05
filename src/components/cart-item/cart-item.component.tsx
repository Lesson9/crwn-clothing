import { FC } from 'react';

import { CartItem as CartItemType } from '../../store/cart/cart.types';

import { CartItemContainer, CartItemDetails } from './cart-item.styles';

type CartItemProps = {
  cartItem: CartItemType;
};

const CartItem = ({ cartItem }: CartItemProps) => {
  const { name, imageUrl, price, quantity } = cartItem;

  return (
    <CartItemContainer>
      <img src={imageUrl} alt={name} />
      <CartItemDetails className='item-details'>
        <span className='name'>{name}</span>
        <span className='price'>
          {quantity} * ${price}
        </span>
      </CartItemDetails>
    </CartItemContainer>
  );
};

export default CartItem;
