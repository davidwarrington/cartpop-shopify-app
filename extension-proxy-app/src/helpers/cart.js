const clear = async ({
    routes,
}) => {
    // Clear cart
    const clearCartItems = await fetch(`${routes.cartClear}.js`);
    const clearRes = await clearCartItems.json();
    
    const cartNote = clearRes.note ? true : false;
    const cartAttributes = clearRes.attributes && Object.keys(clearRes.attributes).length ? true : false;

    // If cart already has a note or attributes, clear them
    if (cartNote || cartAttributes) {
        await update({
            routes,
            payload: {
                note: null,
                attributes: null
            }
        })
    }
    return;
}

const update = ({
    routes,
    body
}) => {
    const clearCart = await fetch(`${routes.cartUpdate}.js`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body)
    });
    const clearRes = await clearCart.json();
    return;
}

const add = async ({
    routes,
    cartItems
}) => {
    // Add new products to cart: https://shopify.dev/api/ajax/reference/cart#post-locale-cart-add-js
    const cartItemsRes = await fetch(`${routes.cartAddTo}.js`,
        {
            headers: {
            'Content-Type': 'application/json',
            },
            method: 'POST',
                body: JSON.stringify({
                items: cartItems
            })
        }
    );
    cartRes = await cartItemsRes.json();
    return;
}

export {
    clear,
    add,
    update
}