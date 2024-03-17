import { useParams } from "react-router-dom";
import { Col, Row, Alert, Form, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import { axiosInstanceWithoutToken } from '../api/axios';
import { BaseUrl } from '../api/index';
import RestaurantListCards from "./RestaurantListCards";
import AppNavbar from "./AppNavbar";
import LocationTypeahead from "./LocationTypeahead";
import '../style/RestaurantListContainer.css';
import CuisineContainer from './CuisineContainer';
import CostContainer from './CostContainer';

function RestaurantListContainer() {
    let limit = 2;
    if(window.innerWidth < 767){
        limit = 3;
    }else {
        limit = 2;
    }
    const [num, setNum] = useState(0);
    const [sortBy, setSortBy] = useState("");
    const cuisine = [
        {
            "code": "NI",
            "name": "North Indian"
        },
        {
            "code": "SI",
            "name": "South Indian"
        },
        {
            "code": "CHN",
            "name": "Chinese"
        },
        {
            "code": "FF",
            "name": "Fast Food"
        },
        {
            "code": "SF",
            "name": "Street Food"
        }
    ];
    const harcodedRestaurants = [
        {
            "code": "BRF",
            "name": "Breakfast"
        },
        {
            "code": "LCH",
            "name": "Lunch"
        },
        {
            "code": "DNR",
            "name": "Dinner"
        },
        {
            "code": "SKS",
            "name": "Snacks"
        },
        {
            "code": "DRK",
            "name": "Drink"
        },
        {
            "code": "NGT",
            "name": "Night"
        }
    ];
    const { timeFilter } = useParams();
    // console.log(timeFilter);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [timing, setTiming] = useState("");
    const [filteredCuisine, setFilteredCuisine] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [restLocation, setRestLocation] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [payload, setPayload] = useState({
        'timing_codes': [timeFilter]
    });

    useEffect(() => {

       console.log("PAyloadchanges")
        restaurentFilter();
     },[payload]);


    function filterTiming() {
        harcodedRestaurants.forEach((item) => {
            if (item.code === timeFilter) {
                setTiming(item.name);
            }
        });
    };


    function sortByOrder(sortBasedOn) {
        setSortBy(sortBasedOn);
        setPayload({ ...payload, 'sortBy': sortBasedOn });
    }

    const restaurentFilter = async () => {
        console.log("hello");
        const defaultPayload = {
            'limit': limit,
            'page': activePage
        };
    
        const payloadToSend = {
            'params': { ...defaultPayload, ...payload }
        };
    
        try {
            const res = await new Promise((resolve, reject) => {
                axiosInstanceWithoutToken.get(`${BaseUrl}/getRestaurants`, payloadToSend)
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            });
    
            console.log(res?.data?.data.resturant);
            setFilteredRestaurants(...res?.data?.data?.restaurant);
            console.log(filteredRestaurants);
    
            const totalPagesArray = [];
            const totalPages = res?.data?.data?.total / limit;
            for (var i = 0; i < totalPages; i++) {
                totalPagesArray.push(i);
            }
            setTotalPages(totalPagesArray);
    
            console.log("hello");
        } catch (error) {
            console.error("Error occurred: ", error.message);
        }
    }
    
    console.log("hello")

    function updateActivePage(activePage) {
        setActivePage(activePage);
    }

    function getLocationPayload(location) {
        console.log("reached_145")
        setRestLocation([...location]);
        console.log(restLocation)
        if (location.length > 0) {
            setPayload({ ...payload, 'location_code': [location[0].code] });
            console.log(payload)
        }
    }

    function getCuisinePayload(name) {

        if (filteredCuisine.find((item) => { 
            return item === name; 
        })) 
        {
            const index = filteredCuisine.findIndex((item) => { return item === name; });
            filteredCuisine.splice(index, 1);
        } 
        else {
            filteredCuisine.push(name);
            setFilteredCuisine([...filteredCuisine]);
        }
        setPayload({ ...payload, 'selectedCuisine': filteredCuisine });
    }

    function getCostPayload(cost) {
        const costRange = JSON.stringify(cost);
        // console.log("CostPayload");
        // console.log(costRange);
        setPayload({ ...payload, 'selectedCostRange': costRange });
    }

    function handleFilter() {
        const leftcol = document.getElementById('filterColumn');
        const dropdown = document.getElementById('dropdown');
        let btn = null;
        let text = null;
        let count = num;
        ++count;

        if (count === 1) {
            dropdown.appendChild(leftcol);

            btn = document.createElement("button");
            text = document.createTextNode("Apply");
            btn.setAttribute("id", "applyBtn");
            btn.appendChild(text);
            leftcol.appendChild(btn);
            leftcol.style.display = "block";
            setNum(2);
        } else {
            document.getElementById('applyBtn').remove();
            setNum(0);
            leftcol.style.display = "none";
        }

        if(document.getElementById('applyBtn')){
            btn.addEventListener("click", (event) => {
                setNum(0);
                document.getElementById('applyBtn').remove();
                leftcol.style.display = "none";
            })
        }       

    }

    return (
        <>
            <AppNavbar page='Other' />
            <div className="ResContainer" onLoad={filterTiming}>
                {/* {JSON.stringify(payload)} */}
                <div>
                    <h1>{timing} places {restLocation.length > 0 ? `in ${restLocation[0].name}` : "available"}</h1>
                </div>
                <Row className="lnrCont">
                    <div id="dropdown" className="row dropdown" onClick={() => handleFilter()}>
                        <div className="fsCont">
                            <h3>Filter / Sort</h3> <div><span>&#10095;</span></div>
                        </div>
                    </div>
                    <Col id="filterColumn" className='leftCol'>
                        <div>
                            <h5>Filters</h5>
                            <h6 className="loaction">Select Location</h6>

                            <div className="locationTypeahead">
                                <LocationTypeahead page="rlc" filterRestaurent={getLocationPayload} />
                            </div>

                            <h6 className="cuisine">Cuisine</h6>
                            <CuisineContainer cuisine={cuisine} getCuisine={getCuisinePayload} />

                            <h6 className="cost">Cost For Two</h6>
                            <CostContainer getCost={getCostPayload} />

                            <h6 className="sort">Sort</h6>
                            <Form className="mb-3">
                                <Form.Check
                                    type="radio"
                                    name="sort"
                                    id="Price low to high"
                                    label="Price low to high"
                                    onChange={() => sortByOrder("lowtohigh")}
                                />
                                <Form.Check
                                    type="radio"
                                    name="sort"
                                    label="Price high to low"
                                    id="Price high to low"
                                    onChange={() => sortByOrder("hightolow")}
                                />
                            </Form>
                        </div>
                    </Col>

                    <Col className='rightCol'>
                        {/* {
                            filteredRestaurants.length === 0 && (<div className="noResultFound">
                                <div>
                                    <h3>Sorry. No result Found</h3> 
                                </div>    
                            </div>)
                        } */}
                        {filteredRestaurants.length > 0 && filteredRestaurants.map((item, index) =>
                            <RestaurantListCards
                                key={index}
                                restaurants={item}
                            />
                        )}

                        <Pagination className="pagenation">
                            {
                                totalPages.map((item, index) =>
                                    <Pagination.Item
                                        key={index}
                                        active={activePage === item + 1}
                                        onClick={() => updateActivePage(item + 1)}
                                    >
                                        {item + 1}
                                    </Pagination.Item>
                                )
                            }
                        </Pagination>
                    </Col>
                </Row>
            </div>

        </>
    );
}

export default RestaurantListContainer;