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

const app = express();
const fs = require("node:fs");
const manifestPath = path.join(process.cwd(), "dist", ".vite", "manifest.json");
const https = require('https');
const classroomsurveyRouter = require("./routes/surveys/classroomSurveyRouter.js");
const disasterSurveyRouter = require("./routes/surveys/disasterSurveyRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const teamRouter = require('./routes/teamRouter.js')
const customSurveyRouter = require('./routes/surveys/customSurveyRouter.js')

setInterval(() => {
  https.get('https://survey-wd-act.onrender.com', (res) => {
    console.log(`Self-ping status: ${res.statusCode}`);
  });
}, 14 * 60 * 1000);

app.locals.isProduction = process.env.NODE_ENV === 'production';
app.locals.umamiUrl = process.env.UMAMI_URL;
app.locals.umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('isProduction:', process.env.NODE_ENV === 'production');
console.log('Umami URL:', process.env.UMAMI_URL);
console.log('Umami ID:', process.env.UMAMI_WEBSITE_ID);


app.use('/dist', express.static(path.join(__dirname, '../dist'))); 
app.use('/dist', express.static(path.join(process.cwd(), "dist")));


app.set("views", path.join(__dirname, "02_views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")))
// app.use(express.static('public'));
app.use(express.static('resources'));

app.use(expressLayouts);
app.set("layout", "layout");

app.use('/dist', express.static('dist'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
app.use("/classroom-survey", classroomsurveyRouter)
app.use("/disaster-survey", disasterSurveyRouter)
app.use("/profile", profileRouter)
app.use("/team", teamRouter)
app.use("/", customSurveyRouter);


app.use((req, res, next) => {
    res.status(404).render('404', { title: '404: File Not Found' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`App is listening to port: ${PORT}`);
});
