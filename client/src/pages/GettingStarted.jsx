import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER, GET_PROVIDERS } from '../utils/queries'; // Adjust the path based on your project structure
import { CREATE_PROVIDER } from '../utils/mutations'; // Adjust the path based on your project structure
import Rating from 'react-rating-stars-component';
import styles from '../styles/getStarted.module.css'; // Ensure you have corresponding CSS
const GetStarted = () => {
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER);

  // Query to fetch providers data
  const { loading: providersLoading, error: providersError, data: providersData } = useQuery(GET_PROVIDERS);
  const [createProvider] = useMutation(CREATE_PROVIDER);

  const [step, setStep] = useState(0);
  const [city, setCity] = useState('');
  const [bootcampType, setBootcampType] = useState('');
  const [bootcampName, setBootcampName] = useState('');
  const [bootcampProviderId, setBootcampProviderId] = useState('');
  const [providerName, setProviderName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [schedule, setSchedule] = useState('');
  const [cost, setCost] = useState('');
  const [curriculumRating, setCurriculumRating] = useState(0);
  const [instructorRating, setInstructorRating] = useState(0);
  const [supportRating, setSupportRating] = useState(0);
  const [overallReview, setOverallReview] = useState(0);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  if (userLoading || providersLoading) return <p>Loading...</p>;

  // Handle errors for both queries
  if (userError) {
    console.error(userError);
    return <p>Error fetching user data</p>;
  }
  if (providersError) {
    console.error(providersError);
    return <p>Error fetching providers data</p>;
  }

  const { username, userStatus } = userData.me;
  const providers = providersData?.getProviders || [];

  const handleSubmitProvider = async (event) => {
    event.preventDefault();
            console.log(providerName);

    try {
      const result = await createProvider({
        variables: {
            name: providerName,
            location: location,
            website: website,
          
        },
      });

      console.log('Created provider:', result.data.createProvider);
      setSubmitAttempted(true); // Set that form submission has been attempted

      // Handle success, e.g., show a success message, update state, etc.
    } catch (error) {
      console.error('Error creating provider:', error);
      // Handle error, e.g., show an error message
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      userStatus,
      city,
      bootcampType,
      bootcampName,
      bootcampProviderId,
      deliveryMode,
      schedule,
      cost,
      curriculumRating,
      instructorRating,
      supportRating,
      overallReview,
      overallFeedback,
    });
    // Additional logic to handle form submission (e.g., send data to backend)
  };

  const handleNext = () => {
    if (submitAttempted || step === 0) { // Check submitAttempted or if it's the first step
      setStep((prevStep) => prevStep + 1);
    }
  };


  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderFormFields = () => {
    switch (userStatus) {
      case 'potential':
        switch (step) {
          case 0:
            return (
              <>
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </>
            );
          case 1:
            return (
              <>
                <label htmlFor="bootcampType">Type of Bootcamp:</label>
                <select
                  id="bootcampType"
                  value={bootcampType}
                  onChange={(e) => setBootcampType(e.target.value)}
                >
                  <option value="">Select a type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="online">Online</option>
                </select>
              </>
            );
          default:
            return null;
        }
      case 'current':
      case 'graduate':
        switch (step) {
          case 0:
            return (
              <>
                <label htmlFor="bootcampProvider">Bootcamp Provider:</label>
                <select
                  id="bootcampProvider"
                  value={bootcampProviderId}
                  onChange={(e) => setBootcampProviderId(e.target.value)}
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </>
            );
          case 1:
            if (bootcampProviderId === 'other') {
              return (
                <>
                  <label htmlFor="providerName">Provider Name:</label>
                  <input
                    type="text"
                    id="providerName"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                  />
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <label htmlFor="website">Website:</label>
                  <input
                    type="text"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <button onClick={handleSubmitProvider}>Create Provider</button>
                </>
              );
            } else {
              return (
                <>
                  <label htmlFor="bootcampName">Bootcamp Name:</label>
                  <input
                    type="text"
                    id="bootcampName"
                    value={bootcampName}
                    onChange={(e) => setBootcampName(e.target.value)}
                  />
                </>
              );
            }
          case 2:
            return (
              <>
                <label htmlFor="deliveryMode">Delivery Mode:</label>
                <select
                  id="deliveryMode"
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value)}
                >
                  <option value="">Select a mode</option>
                  <option value="in-person">In-person</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </>
            );
          case 3:
            return (
              <>
                <label htmlFor="schedule">Schedule:</label>
                <select
                  id="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <option value="">Select a schedule</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </>
            );
          case 4:
            return (
              <>
                <label htmlFor="cost">Cost:</label>
                <input
                  type="number"
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </>
            );
          case 5:
            return (
              <>
                <label htmlFor="curriculumRating">Curriculum Rating:</label>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={curriculumRating}
                  onChange={(value) => setCurriculumRating(value)}
                />
              </>
            );
          case 6:
            return (
              <>
                <label htmlFor="instructorRating">Instructor Rating:</label>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={instructorRating}
                  onChange={(value) => setInstructorRating(value)}
                />
              </>
            );
          case 7:
            return (
              <>
                <label htmlFor="supportRating">Support and Resources Rating:</label>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={supportRating}
                  onChange={(value) => setSupportRating(value)}
                />
              </>
            );
          case 8:
            return (
              <>
                <label htmlFor="overallReview">Overall Review:</label>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={overallReview}
                  onChange={(value) => setOverallReview(value)}
                />
                <label htmlFor="overallFeedback">Anything you'd like to say about your experience:</label>
                <input
                  id="overallFeedback"
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                />
              </>
            );
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <div className={styles.getStarted}>
      <div className={styles.getStartedContent}>
        <h2>Thanks for joining, {username}!</h2>
        <p>To help you get the best experience possible we need some information.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.getStartedForm}>
        {renderFormFields()}
        <div className={styles.formNavigation}>
          {step > 0 && (
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {step < (userStatus === 'potential' ? 1 : 8) && (
            <button type="button" onClick={handleNext} disabled={step === 1 && !submitAttempted}>
              Next
            </button>
          )}
          {step === (userStatus === 'potential' ? 1 : 8) && (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GetStarted;
