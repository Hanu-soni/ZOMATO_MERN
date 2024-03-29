import { Routes, Route } from "react-router-dom";
import LandingPage from '../components/LandingPage';
import RestaurantListContainer from '../components/RestaurantListContainer';
import RestaurantDetail from '../components/RestaurantDetail';
// import Component from '../Component';

function ZomatoRoutes() {
    console.log("all good")
    return (
        <Routes>
            {/* <Route exact path="/" element={<Component />} /> */}
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/restaurant/list/:timeFilter" element={<RestaurantListContainer />} />
            <Route path='/restaurant/:id' element={<RestaurantDetail />} />
            <Route path="*" element={<h1>404 Cannot find main Landing Page</h1>} />
        </Routes>
    );
}

export default ZomatoRoutes;