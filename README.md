## Getting Started

Thank you again for the opportunity to be part of Tofu, I put my heart into this submission. I am excited about the prospect of bringing my experience and expertise to the team and helping in any way I could.

## How to start the application

1. To start you'll need to create a .env file and populate the NEXT_PUBLIC_BEARER_TOKEN variable with the bearer token.

2. In the terminal, you'll have to run **npm install** to install packages.

3. Run **npm run build**

4. You can **run npm run start**

5. You'll need to then head to http://localhost:3000/content in order to see the application.

## What went well

I am happy that basic updates to the text, highlighting and dehighlighting work as well as the UI looking true to the mock up. I even added little touches here and there to add polish to it and to encourage a great user experience. I went ahead and added the additional optional features like custom prompts and a select element that contained the targets. I added ordering to the components so the user doesn't get confused or make mistakes when deleting/dehighlighting components. I am very happy with the way the UI handles the POST calls and the PATCH calls. I went with highlighting the text with the cursor and have it show instantly, that was cool.

## What didn't go well

The highlighting and dehighlighting was particuarly tough as I needed to get the shape of the patch when updating the content and the components. I didn't want to introduce duplicates or have text removed. This was challenging at times but I managed. I would like to improve parts of the code that were repetitive, particularly the removing of hightling/components. If I had more time I would most certainly move some of that logic into a function(s) that would live in the utility methods.js file I created for that stuff. I also was confused a little about the exact shape of the patch call and went down the wrong path a bit due to misinterpretation and making particular assumptions, so I burned some time there. I tried to squash every bug, but I wanted to sandbox the exercise.

## What did I learn

I also learned that Tofu is doing some really cool things and it was evident by the time I was playing with the generate POST call. It was really fun playing with the custom prompts and the targets. I was blown away by the responses. This makes me even more enthusiastic about AI and what the future holds. Tofu is inspiring me to play more with AI and to partake in this dance.

## Suggestions to make user experience better

I would add coaching tips when the user initially interacts with the application and then not show it when the user selects do not show again. I think that would be nice so the user could understand what is possible and what to do. If I were to redo the application, I may go with slate.js as it's similar to Notion and the experience is decent.

## Feedback about the API endpoints

I thought the endpoints were great. Maybe if there were multiple collaborators in the future, using websockets would be a decent idea. For me however the experience was fun and wonderful.

## Thank you
