# Auto Quiz Generation Guide for Teachers

This guide explains how to use the Auto Quiz Generation feature powered by Google's Gemini AI to create quizzes for your subjects.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Accessing the Feature](#accessing-the-feature)
3. [Generating a Quiz](#generating-a-quiz)
4. [Reviewing and Editing Generated Quizzes](#reviewing-and-editing-generated-quizzes)
5. [Saving Your Quiz](#saving-your-quiz)
6. [Best Practices](#best-practices)

## Prerequisites

Before you can use the Auto Quiz Generation feature, ensure that:

1. You have a valid Google Gemini API key
2. The API key is properly configured in your environment variables
3. You have teacher privileges in the system

## Accessing the Feature

1. Navigate to the subject page for which you want to create a quiz
2. Scroll down to the Quiz Management section
3. Look for the "Generate with AI" button (only visible to teachers)
4. Click the button to open a confirmation dialog
5. Confirm that you want to generate a quiz with AI

This will open the quiz generation interface where you can enter your content and generate a quiz.

## Generating a Quiz

You can generate a quiz in two ways:

### Option 1: Manual Content Entry
1. **Enter Subject Content**:
   - Paste or type the content you want to create a quiz from in the "Subject Content" text area
   - The content should be at least 50 characters long for better quiz generation
   - The more detailed and comprehensive your content, the better the generated questions will be

### Option 2: Upload a PDF Document
1. **Upload PDF**:
   - Click on the "Upload PDF" tab
   - Either click the upload area or drag and drop a PDF file
   - The system will automatically extract text content from your PDF
   - Supported formats: PDF files only
   - File size limit: 10MB
   - The PDF should contain sufficient text content (at least 50 characters) for quiz generation

For both options:

2. **Configure Quiz Settings**:
   - Set the number of questions (1-20)
   - Select the difficulty level (Easy, Medium, Hard)
   - The system will automatically calculate a time limit based on the number of questions

3. **Generate the Quiz**:
   - Click the "Generate Quiz" button
   - The AI will process your content and create a quiz with multiple-choice questions
   - This may take a few seconds depending on the complexity of the content
   - You'll see a loading indicator during the generation process

## Reviewing and Editing Generated Quizzes

After the quiz is generated, you'll see a success message with options to create another quiz or continue to quiz management. The generated quiz is automatically saved to your subject.

If you want to make changes to the quiz:

1. Navigate to the Quiz Management page for your subject
2. Find the generated quiz in the list
3. Click the "Edit" button to modify the quiz details and questions

You can:

1. **Edit Quiz Details**:
   - Modify the quiz title
   - Update the description
   - Adjust the difficulty level
   - Change the time limit

2. **Review Questions**:
   - Check each question for accuracy
   - Verify that the correct answers are properly marked
   - Edit question text if needed
   - Modify answer options
   - Update explanations for correct answers
   - Adjust point values based on difficulty

3. **Modify Individual Questions**:
   - Add new questions manually
   - Remove questions that don't fit your needs
   - Reorder questions using the drag handles

## Saving Your Quiz

Quizzes generated with AI are automatically saved to your subject. You can access them at any time from the Quiz Management page to make further edits.

## Best Practices

1. **Content Quality**:
   - Provide clear, well-structured content for the best results
   - Break complex topics into smaller sections for more focused quizzes
   - Include key terms and concepts you want to test

2. **Review Generated Content**:
   - Always review AI-generated questions for accuracy
   - Verify that the difficulty level matches your expectations
   - Check that explanations are clear and helpful

3. **Customization**:
   - Use the editing features to tailor quizzes to your specific needs
   - Add your own questions to supplement AI-generated ones
   - Adjust point values to match your grading system

4. **Iterative Improvement**:
   - Generate multiple quizzes from the same content and combine the best questions
   - Refine your content input based on the quality of generated quizzes
   - Save successful quiz templates for future use

## Troubleshooting

If you encounter issues with the auto quiz generation:

1. **Check Your API Key**: Ensure your Gemini API key is correctly configured
2. **Content Length**: Content shorter than 50 characters may produce suboptimal results
3. **Network Issues**: Ensure you have a stable internet connection
4. **Contact Support**: If problems persist, contact your system administrator

## Feedback and Support

We're continuously improving this feature. If you have suggestions or encounter issues:

- Email: support@learnspark.edu
- Feedback Form: Available in the Settings section

Thank you for using the Auto Quiz Generation feature to enhance your teaching experience!