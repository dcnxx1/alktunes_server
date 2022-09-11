# Alktunes🎵 - A more technical review 🤖!

## Create playlists, add tracks to your newly created playlists -- and relax ☺

### This application is built using React, NodeJS and AWS. 


#### Before we dive in:

I chose AWS for a good reason. I already have experience with other cloud computing services like Azure and GCP. 
The problem with Azure is that I couldn't event get started making an application because the documentation didn't make sense to me and it was difficult
to get a grasp. GCP on the other hand has a more lenient learning curve. I have hosted a full-stack application on GCP in the past with great success; well, atleast, until my free $300 were expired.

But nothing tops AWS!

It's the leading cloud computing service for a good reason. A lot of the documentation is clear and straightforward. AWS offers a lot of services and is free-tier friendly.
Thats why it's my primary choice for application hosting and infrastucture building. 

----

Let's dive deeper in what powers this application.

First of all ... 

# Cloud Computing

Obviously🙄. So here's what's inside my cloud computing environment.

Let's start with the services that lets requests flow smoothly through the cloud: 

- EC2 - Virtual computer
- RDS - Relational database
- API Gateway - Api Gateway 
- Lamba - Serverless functions
- DynamoDB - NoSQL database
- CloudSearch - Search Engine
- Event Bridge - Event Bus
- S3 - File storage

### EC2 
 Used to host the back-end portion of the application. Inside this EC2 instance is a webserver running Nodejs.
 I've set up a reverse proxy to make outcoming request accessible to the webserver.
 But thats not all. I also PM2, which is a daemon tool to let the webserver up and running. 
 
 ---
Let's move onto the Lambda functions 

### Lambda 
  I have created lambda functions for 3 particular tasks: 
   1. Lambda function to handle CRUD operations on a playlist
   2. Lambda function to handle CRUD operations on a track.
   3. Lambda function to shuffle content for the homepage
   
  All these 3 lambda functions communicate to a DynamoDB databse, which is ofcourse a NoSQL database. 
  
As I've stated earlier, they perfrom CRUD operations. But what exactly do they put and retrieve from the database? 
 The playlist lambda function handles everything related to creating and deleting playlists. 
  


 
