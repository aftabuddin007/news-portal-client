import { Outlet } from 'react-router';

const Rootlayout = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Rootlayout;