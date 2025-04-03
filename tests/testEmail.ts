import sendThankYouEmail from '../src/services/mailService';

// Email test function
const testEmail = async () => {
  try {
    await sendThankYouEmail({
      recipientEmail: 'hoangpm2003.strix@gmail.com',
      name: 'Hoang',
    });
    console.log('🎉 Email sent successfully!');
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
};

// Run the test
testEmail();
