import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">401</h1>
                <p className="fs-3 text-danger">Unauthorized</p>
                <p className="lead">
                    You must be logged in to continue
                </p>
                <Button onClick={() => navigate('/login')} className='border-0 btn mx-3 rounded-pill px-3 py-1 fw-bold' style={{ backgroundColor: "#5271fd" }}>Login</Button>
            </div>
        </div>
    );
};

export default NotFound;
