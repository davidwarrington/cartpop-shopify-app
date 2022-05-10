export const up = async (db, client) => {
  // Set default link settings
  await db.collection("links").updateMany(
    {},
    {
      $set: {
        settings: {
          clearCart: true,
          destination: "checkout",
        },
      },
    }
  );
};

export const down = async (db, client) => {
  await db.collection("links").updateMany(
    {},
    {
      $unset: { settings: {} },
    }
  );
};
