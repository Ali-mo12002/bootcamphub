import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Navigate, useNavigate } from 'react-router-dom';

import { GET_USER, GET_PROVIDERS, GET_COURSES_BY_PROVIDER_ID } from '../utils/queries'; // Adjust the path based on your project structure
import { CREATE_PROVIDER, CREATE_COURSE, UPDATE_GRAD_INFO, SUBMIT_REVIEW } from '../utils/mutations'; // Adjust the path based on your project structure
import Rating from 'react-rating-stars-component';
import styles from '../styles/getStarted.module.css'; // Ensure you have corresponding CSS
import Select from 'react-select';

const GetStarted = () => {
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER);
  const { loading: providersLoading, error: providersError, data: providersData } = useQuery(GET_PROVIDERS);
  const [createProvider] = useMutation(CREATE_PROVIDER);
  const [createCourse] = useMutation(CREATE_COURSE);
  const [updateGradInfo] = useMutation(UPDATE_GRAD_INFO);
  const [submitReview] = useMutation(SUBMIT_REVIEW);

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
  const [overallRating, setOverallRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [providerCreated, setProviderCreated] = useState(false);
  const [courseCreated, setCourseCreated] = useState(false);
  const [fetchCourses, setFetchCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [graduationDate, setGraduationDate] = useState('');
  const [bootcampId, setBootcampId] = useState(0); // Use state for bootcampId

  const { loading: coursesLoading, error: coursesError, data: coursesData } = useQuery(GET_COURSES_BY_PROVIDER_ID, {
    variables: { providerId: bootcampProviderId },
    skip: !fetchCourses,
  });

  useEffect(() => {
    if (bootcampProviderId && bootcampProviderId !== 'other' && coursesData && coursesData.getCoursesByProvider) {
      setCourses(coursesData.getCoursesByProvider);
    }
  }, [coursesData, bootcampProviderId]);

  useEffect(() => {
    if (step === 1 && bootcampProviderId === 'other') {
      setFetchCourses(false);
    } else if (step === 1 && bootcampProviderId !== 'other') {
      setFetchCourses(true);
    }
  }, [step, bootcampProviderId]);

  const handleSubmitProvider = async (event) => {
    event.preventDefault();

    try {
      const result = await createProvider({
        variables: {
          name: providerName,
          location: location,
          website: website,
        },
      });

      console.log('Created provider:', result.data.createProvider);
      setBootcampProviderId(result.data.createProvider.id);
      setProviderCreated(true);
    } catch (error) {
      console.error('Error creating provider:', error);
    }
  };

  const handleSubmitCourse = async (event) => {
    event.preventDefault();

    try {
      const result = await createCourse({
        variables: {
          providerId: bootcampProviderId,
          name: bootcampName,
          deliveryMode,
          schedule,
          cost: parseFloat(cost),
        },
      });

      console.log('Created course:', result.data.createCourse);
      setCourseCreated(true);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };
  const handleChangeSelect = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (step === 1 && bootcampProviderId && bootcampProviderId !== 'other') {
      setBootcampName(selectedOption.value);
      setBootcampId(selectedOption.value);
      console.log(bootcampId);

    } else {
      setBootcampProviderId(selectedOption.value);
    }
    console.log('Selected :', selectedOption);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await updateGradInfo({
        variables: {
          graduationDate: graduationDate,
          courseId: selectedOption.value,
        },
      });

      console.log('Updated grad info:', result.data.updateGradInfo);

      // After updating grad info, proceed to review submission
    } catch (error) {
      console.error('Error updating grad info:', error);
    }
  };
  const navigate = useNavigate();

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    try {
      console.log(overallRating);
      console.log(bootcampId)
      const result = await submitReview({
        variables: {
          courseId: bootcampId,
          curriculumRating: curriculumRating,
          instructorRating: instructorRating,
          supportRating: supportRating,
          overallRating: overallRating,
          feedback: feedback,
        },
      });

      console.log('Submitted review:', result.data.submitReview);
      navigate('/')
      // Additional logic for post-submit action
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (userLoading || providersLoading || coursesLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (coursesError) return <p>Error: {coursesError.message}</p>;
  if (providersError) return <p>Error: {providersError.message}</p>;

  const providers = providersData?.getProviders || [];

  const handleNext = async () => {
    if (step === 1 && bootcampProviderId === 'other' && !providerCreated) {
      return; // Prevent moving to the next step if provider has not been created
    }

    if (step === 1 && bootcampProviderId && bootcampProviderId !== 'other') {
      setFetchCourses(true);
    }
    if (step === 8 && !courseCreated) {
      return; // Prevent moving to the next step if course has not been created
    }
    setStep((prevStep) => prevStep + 1);
  console.log(step);
    setSelectedOption(null);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderFormFields = () => {
    switch (userData.me.userStatus) {
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
                <Select
                  id="bootcampProvider"
                  className={styles.selectReact}
                  value={selectedOption}
                  onChange={handleChangeSelect}
                  options={[
                    ...providers.map(provider => ({
                      value: provider.id,
                      label: provider.name,
                    })),
                    { value: 'other', label: 'Other' }
                  ]}
                  placeholder="Select a provider"
                />
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
            } else if (courses.length > 0) {
              return (
                <>
                  <label htmlFor="bootcampCourse">Bootcamp Course:</label>
                  <Select
                    id="bootcampCourse"
                    className={styles.selectReact}
                    value={selectedOption}
                    onChange={handleChangeSelect}
                    options={courses.map(course => ({
                      value: course.id,
                      label: course.name,
                    }))}
                    placeholder="Select a course"
                  />
                  <label htmlFor="graduationDate">Graduation Year:</label>
                  <input
                    type="text"
                    id="graduationDate"
                    value={graduationDate}
                    onChange={(e) => setGraduationDate(e.target.value)}
                  />
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
                  <label htmlFor="deliveryMode">Delivery Mode:</label>
                  <Select
                    id="deliveryMode"
                    className={styles.selectReact}
                    value={{ value: deliveryMode, label: deliveryMode }}
                    onChange={(option) => setDeliveryMode(option.value)}
                    options={[
                      { value: 'in-person', label: 'In-person' },
                      { value: 'remote', label: 'Remote' },
                      { value: 'hybrid', label: 'Hybrid' },
                    ]}
                    placeholder="Select a mode"
                  />
                  <label htmlFor="schedule">Schedule:</label>
                  <Select
                    id="schedule"
                    className={styles.selectReact}
                    value={{ value: schedule, label: schedule }}
                    onChange={(option) => setSchedule(option.value)}
                    options={[
                      { value: 'full-time', label: 'Full-time' },
                      { value: 'part-time', label: 'Part-time}' },
                    ]}
                    placeholder="Select a Schedule"
                  />
                  <label htmlFor="cost">Cost:</label>
                  <input
                    type="number"
                    id="cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                  <button onClick={handleSubmitCourse}>Create Course</button>
                </>
              );
            }
          
          case 2:
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

          case 3:
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
          case 4:
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
          case 5:
            return (
              <>
                <label htmlFor="overallRating">Overall Rating:</label>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={overallRating}
                  onChange={(value) => setOverallRating(value)}
                />
                <label htmlFor="feedback">Anything you'd like to say about your experience:</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
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
        <h2>Thanks for joining, {userData.me.username}!</h2>
        <p>To help you get the best experience possible we need some information.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.getStartedForm}>
        {renderFormFields()}
        <div className={styles.formNavigation}>
          {step > 0 && (
            <button type="button" onClick={handlePrevious}>
              Go Back
            </button>
          )}
          {step < (userData.me.userStatus === 'potential' ? 1 : 5) && (
            <button
              type="button"
              onClick={handleNext}
              disabled={(step === 1 && bootcampProviderId === 'other' && !providerCreated) || (step === 5 && !courseCreated)}
            >
              Next
            </button>
          )}

         

          {step === 5 && (
            <button type="button" onClick={handleSubmitReview} >Submit Review</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GetStarted;
