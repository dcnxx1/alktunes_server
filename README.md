# Alktunes🎵 - A more technical review 🤖!

## Create playlists, add tracks to your created playlists, play -- and relax ☺

### This application is built using React, NodeJS and AWS. 


#### Before we dive in:

I chose AWS for a good reason. I already have experience with other cloud computing services like Azure and GCP. 
The problem with Azure is that I couldn't event get started making an application because the documentation didn't make sense to me and it was difficult
to get a grasp. GCP on the other hand has a more lenient learning curve. I have hosted a full-stack application on GCP in the past with great success; well, atleast, until my free $300 were expired.

But nothing tops AWS!

A lot of the documentation is clear and straightforward. AWS offers a lot of services and is free-tier friendly.
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
 
### RDS
 #### MySQL

For storing and retrieving user credentials.
 
 ---
 
### API Gateway 

To route requests to the Lambda functions
 
--- 
 
Let's move onto the Lambda functions 

### Lambda 
  I have created lambda functions for 3 particular tasks: 
   1. Lambda function to handle CRUD operations on a playlist
   2. Lambda function to handle CRUD operations on a track.
   3. Lambda function to shuffle content for the homepage
   
These 3 lambda function communicate with the DynamoDB instance where all the tracks, playlists and the shuffled
tracks are stored. 

---
### DynamoDB 

#### NoSQL

There are 3 tables in my DynamoDB instance: 
 1. Table for storing user playlists 
 2. Table for storing all the songs available. 
 3. The shuffled content recieved from the lambda function 

---

I've also added a search engine 

### CloudSearch

#### Search engine  

I picked CloudSearch over OpenSearch -- which is another search engine service available on AWS, because of it's
simplicity. I've indexed all the tracks so users can search by: 
 1. Artist name
 2. Track name
 3. Album name

---

### Event Bridge
 #### Event bus
 
 The Event Bridge instance triggers the lambda function for shuffling tracks every 3 hours. This simulates user activity and it's as if the content in the homepage is based on user data. '
 
 ---
 
 ### S3 
 #### File storage. 
 
 For storing MP3 sources and album covers

---

Here is a visual of the above: 




![alt text](https://raw.githubusercontent.com/dcnxx1/alktunes_server/main/infrastrucutre/alktunes_infrastructure.png "Link to visual")
 


 
