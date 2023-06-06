import mainRoutes from "./main.js";

const constructorMethods = (app) => {
  app.use("/", mainRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethods;
