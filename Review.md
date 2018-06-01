# Review Questions

## What is Node.js?

    NodeJS is a JavaScript Runtime environment that allows us to use JavaScript outside of a web browser. 

## What is Express?

    Express is a Node framework used to abstract away some of the difficult pieces of setting up a Node server. It is the most popular Node framework out there. Express gives us, (the developers), the ability to write clean, efficient code, and it also allows us to rapidly build out a web server.

## Mention two parts of Express that you learned about this week.

    Body parser is a middleware package that we can plug into our node server and make available wherever our server is used. This package allows us to parse data that comes through our server into a specified format for fluid use, such as JSON. Specifying data format types early on helps developers and others work with their server. JSON is one of the most common data formats today.

    Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

    Middleware functions can perform the following tasks:

    Execute any code.
    Make changes to the request and the response objects.
    End the request-response cycle.
    Call the next middleware function in the stack.

## What is Middleware?

    Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

    Middleware functions can perform the following tasks:

    Execute any code.
    Make changes to the request and the response objects.
    End the request-response cycle.
    Call the next middleware function in the stack.

## What is a Resource?

    A resource is data within a database. 

## What can the API return to help clients know if a request was successful?

    A 2xx status code and the requested resource will be sent to the client if the request was successful. 

## How can we partition our application into sub-applications?

    This question was skipped as requested by instructor. 

## What is CORS and why do we need it?

    Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin. A web application makes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, and port) than its own origin. As developers, we need CORS to enable our node web servers to grant access to resources within a database when our applications request them. 