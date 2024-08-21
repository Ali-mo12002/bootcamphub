import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import styles from '../styles/network.module.css'
import { useQuery } from '@apollo/client';

import { GET_RECOMMENDED_PEOPLE } from '../utils/queries';
import Auth from '../utils/auth';
const Network = () => {
  const userId = Auth.getProfile().data._id; // Get the current user's ID
  const { loading, error, data } = useQuery(GET_RECOMMENDED_PEOPLE, { variables: { userId } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const recommendedPeople = data.getRecommendedPeople;

  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.networkFeed}>
        <h1> Network</h1>
        </div>
        <div className={styles.recommendedPeople}>
        <h2>People You May Know</h2>
        {recommendedPeople.length > 0 ? (
            recommendedPeople.map((person) => (
              <div key={person.id} className={styles.recommendedPerson}>
                
                <div className={styles.personInfo}>
                  <h4>{person.username}</h4>
                  <p>Graduation Year: {new Date(parseInt(person.graduationDate)).getFullYear()}</p>
                  <p>City: {person.city}</p>
                  {/* Add a button to follow/unfollow this person */}
                  <button className={styles.followButton}>Follow</button>
                </div>
              </div>
            ))
          ) : (
            <p>No recommendations available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network; // Ensure there is a default export
