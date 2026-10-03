export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const p = action.product;
      const existing = state.find(
        (i) => i.id === p.id
      );

      if (existing) {
        if (existing.quantity >= existing.stock) {
          return state;
        }

        return state.map((i) =>
          i.id === p.id
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        );
      }

      if (p.stock < 1) {
        return state;
      }

      return [
        ...state,
        {
          id: p.id,
          title: p.title,
          price: p.price,
          thumbnail: p.thumbnail,
          stock: p.stock,
          quantity: 1,
        },
      ];
    }

    case "RESTORE":
      return action.items;

    case "INCREMENT":
      return state.map((i) =>
        i.id === action.id &&
        i.quantity < i.stock
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      );

    case "DECREMENT":
      return state
        .map((i) =>
          i.id === action.id
            ? {
                ...i,
                quantity: i.quantity - 1,
              }
            : i
        )
        .filter((i) => i.quantity > 0);

    case "REMOVE":
      return state.filter(
        (i) => i.id !== action.id
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}