require("dotenv").config();
require("dotenv").config({ path: '.env.local' });
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");
const express = require("express");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("../lib/prisma.js");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const userQuery = require("./01_models/userQuery.js");

const indexRouter = require("./routes/indexRouter.js");
const loginRouter = require("./routes/loginRouter.js");
const registerRouter = require("./routes/registerRouter.js")
const surveyRouter = require("./routes/surveys/surveyRouter.js")

const app = express();
const fs = require("node:fs");
const manifestPath = path.join(process.cwd(), "dist", ".vite", "manifest.json");

app.use('/dist', express.static(path.join(__dirname, '../dist'))); 
app.use('/dist', express.static(path.join(process.cwd(), "dist")));

app.use((req, res, next) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.locals.isProduction = isProduction;
    res.locals.user = req.user || null; 
    
    res.locals.jsFile = "";
    res.locals.cssFile = "";

    if (isProduction) {
        try {
            const manifestPath = path.join(__dirname, "../dist/.vite/manifest.json");
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

            const mainEntry = manifest["resources/js/main.js"]; 
            
            if (mainEntry) {
                res.locals.jsFile = mainEntry.file;
                res.locals.cssFile = mainEntry.css ? mainEntry.css[0] : "";
            }
        } catch (err) {
            console.error("Vite manifest not found. Make sure to run 'pnpm run build' before 'pnpm start'.");
        }
    }
    next();
});

app.set("views", path.join(__dirname, "02_views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))
// app.use(express.static('public'));;

app.use(expressLayouts);
app.set("layout", "layout");

app.use('/dist', express.static('dist'))
app.use(express.urlencoded({ extended: false }));


app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdFunction: undefined,
      dbRecordIdIsSessionId: true,
    }),
  }),
);
app.use(passport.initialize())
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (userEmail, password, done) => {
      try {
        const user = await userQuery.getEmail(userEmail);

        if (!user) {
          return done(null, false, { message: "Incorrect Email" });
        }

        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userQuery.getId(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/", indexRouter);
app.use("/register", registerRouter)
app.use("/login", loginRouter);
app.use("/logout", (req, res, next) => {
  req.logOut((err) => {
    if(err) {
      return next(err)
    }
    res.redirect("/")
  })
})
app.use("/classroom-survey", surveyRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`App is listening to port: ${PORT}`);
});
