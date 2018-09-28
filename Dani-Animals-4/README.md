# Dani Animals 4

Dani Animals 4 is an MVC web app built using Node, Express, and MongoDB. Notably, this was a new use of an architecture pattern that I’d only used in the .NET world in the past. Many implementations of the Express middleware do a decent job of separating concerns within the application, but it was cool to see how I could use the MVC framework to clean up my Node/Express application in a new way!

Available endpoints:
`/animals/test`, GET
`/animals` > GET, POST
`/animals/:id` > GET, PUT, DELETE