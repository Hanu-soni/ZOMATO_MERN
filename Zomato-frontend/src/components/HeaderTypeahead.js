import { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useNavigate } from 'react-router-dom';
import '../style/HeaderTypeahead.css';
import LocationTypeahead from './LocationTypeahead';
import {axiosInstanceWithoutToken} from '../api/axios';
import { BaseUrl } from '../api/index';

function HeaderTypeahead() {
    const navigate = useNavigate();
    const [selectedRestaurant, setSelectedRestaurant] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
 
    useEffect(() => {
        console.log("going good")

        if (selectedRestaurant.length > 0) {
           // console.log(selectedRestaurant)
            const restaurantCode = selectedRestaurant[0].code;
            navigate(`/restaurant/${restaurantCode}`, { state: selectedRestaurant[0] })
        }
    }, [selectedRestaurant]);


    return (
        <div className='headerInput'>

            <LocationTypeahead filterRestaurent={restaurentFilter} />

            <Typeahead
                // filterBy={'id'}
                className='restaurentsInput'
                labelKey='name'
                id='restaurants'
                options={filteredRestaurants}
                placeholder="Choose a Restaurants..."
                selected={selectedRestaurant}
                onChange={setSelectedRestaurant}
                 disabled={selectedLocation.length === 0}
            />
        </div>

    );

    function restaurentFilter(location) {
        setSelectedLocation([...location]); // Update selectedLocation state
        
        // Use the callback function provided by setSelectedLocation
        setSelectedLocation((updatedLocation) => {
            console.log(updatedLocation); // This will log the updated value of selectedLocation
    
            if (updatedLocation.length > 0) {
                const location_code = updatedLocation[0].code;
                const payloadToSend = {
                    params: {
                        location_code: [location_code]
                    }
                };
    
                axiosInstanceWithoutToken
                    .get(`${BaseUrl}/getRestaurants`, payloadToSend)
                    .then((res) => {
                        console.log(res);
                        console.log(res.data.data.resturant);
                        setFilteredRestaurants(res?.data.data.resturant);
                    });
            }
    
            // Make sure to return the updatedLocation value from the callback
            return updatedLocation;
        });
    }
    
}

export default HeaderTypeahead;