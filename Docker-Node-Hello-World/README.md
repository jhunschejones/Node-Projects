# Docker Node Hello World

This is a quick Node + Express app to test running a Node.js application inside docker and accessing it on a local port.

To build the docker image
`docker build -t <image name> .`

Run the image on a public port
`docker run -p <public port>:<app port> -d <docker image name>`

(i.e. `docker run -p 3000:3000 -d docker-node-hello-world`)

To list the process ID:
`docker ps`

To remove the container
`docker rm -f [container ID]`