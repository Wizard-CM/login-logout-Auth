// Steps ///

=> npm init
=> package.json editing (module , dev)
=> npm i express mongoose
=> creating a server through express

=> npm i ejs + ejs configure
=> views folder + ejs files
=> public folder + static files setup using middleware
=> building contact form in ejs file and form_method === post

=> Configure for using post data : app.use(express,urlencoded({extended:true}))
=> reading that form submitted data in : app.post("/")

=> Creating a database setup
=> adding data to the database through app.post("/") route




// Authendication Logic 

1) "/" Route mah if there is any cookie stored , then render Logout page 
   If there are not any cookies stored , then redirect to "/login" get route.
   '/login' ko get route mah render "login" page.

2) Jaba login ko page mah jancha , ani form bhoresi login button click garincha 
   ,taba tyo form submission ko data post route ko "/login" mah jancha.
   tyo post route ko "/login" leh also will ultimately redirect to "/"get route.

3) Once the login is done , then their appears the logout page ,
   Jaba logout page ko logout button click huncha, taba "/logout" ko "get" route lai hit garcha .
   Tesle pani ultimately "/" route lai redirect garcha  


4) While creating a database entry , register page bata entry garda chai matra tyo user lai database mah store garne
   Login page bata garda , tyo user lai check garne , if it exists in the database or not .
   If yes , render the logout page else render the register page.




   // Check //
   => app.post bata redirect huda get route mah redirect hoki k ho
   => tyo post method ko form ko data , post ko kun route mah aaucha if the route is not set to the form
