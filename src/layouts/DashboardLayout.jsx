import { Link, Outlet } from "react-router";
import { GoFileMedia } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { FaRegIdCard, FaRegPenToSquare, FaUserPen } from "react-icons/fa6";
import { PiCardsBold } from "react-icons/pi";
import { GrGallery } from "react-icons/gr";
import { CgPoll } from "react-icons/cg";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { GiNewspaper } from "react-icons/gi";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const{logOut}=useAuth();
  const handleLogout=()=>{
    logOut()
    .then(()=>{
      console.log('logout success');})
      .catch(error=>{
        console.log(error.message)
      })}
    return (
      <div className="drawer lg:drawer-open">
  <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
  <div className="drawer-content">
    {/* Navbar */}
    <nav className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
        {/* Sidebar toggle icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
      </label>
        <div className="flex *:flex-row items-center justify-between w-full">
      <div className="px-4">Admin Page</div>
      <div className="">
        <div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn m-1">Admin</div>
  <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li><a>Profile</a></li>
    <li><a onClick={handleLogout}>LogOut</a></li>
  </ul>
</div>
      </div>
      </div>
    </nav>
    {/* Page content here */}
    <Outlet></Outlet>
  </div>

  <div className="drawer-side is-drawer-close:overflow-visible">
    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
      {/* Sidebar content here */}
      
      <ul className="menu w-full grow">
        {/* List item */}
        <li>
          <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
            {/* Home icon */}
            <RxDashboard />

            <span className="is-drawer-close:hidden">Dashboard</span>
          </button>
        </li>

        {/* List item */}
        <li>
          <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
            {/* Settings icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
            <span className="is-drawer-close:hidden">Settings</span>
          </button>
        </li>
       
       <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Parent">
      {/* Settings icon */}
      <GoFileMedia />


      <span className="is-drawer-close:hidden">Media Library</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <Link to="/add-media">Add Media</Link>
      </li>

      <li>
        <Link to="/all-media">All Media</Link>
      </li>
    </ul>
  </details>
</li>
       <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Article">
      {/* Settings icon */}
      <FaRegPenToSquare />



      <span className="is-drawer-close:hidden">Article</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">Add Article </a>
      </li>

      <li>
        <a href="/sub2">All Article</a>
      </li>
      <li>
        <a href="/sub2">Published Article</a>
      </li>
      <li>
        <a href="/sub2">Pending Article</a>
      </li>
      <li>
        <a href="/sub2">Rejected Article</a>
      </li>
    </ul>
  </details>
</li>
    <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
      <FaRegIdCard />


      <span className="is-drawer-close:hidden">Career</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <Link to="/career/inbox">Inbox </Link>
      </li>

     
    </ul>
  </details>
</li>
    <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
      <PiCardsBold />


      <span className="is-drawer-close:hidden">Photo Story</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">Add Story </a>
      </li>
      <li>
        <a href="/sub1">All Story </a>
      </li>
      <li>
        <a href="/sub1">Story Setting </a>
      </li>

     
    </ul>
  </details>
</li>
  <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
      <GrGallery />


      <span className="is-drawer-close:hidden">Photo Gallery</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">Add Gallery </a>
      </li>
      <li>
        <a href="/sub1">All Gallery </a>
      </li>

     
    </ul>
  </details>
</li>
  <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
      <GiNewspaper />


      <span className="is-drawer-close:hidden">Newspaper</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">My Newspaper </a>
      </li>
     

     
    </ul>
  </details>
</li>
  <li>
  
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Video Gallery">
      {/* Settings icon */}
      <MdOutlineVideoLibrary />


      <span className="is-drawer-close:hidden">Video Gallery</span>
    </summary>

    {/* Dropdown items */}
    
  
</li>
  <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
      <CgPoll />


      <span className="is-drawer-close:hidden">Poll</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">Add Poll </a>
      </li>
      <li>
        <a href="/sub1">All polls </a>
      </li>
      <li>
        <a href="/sub1">polls Setting</a>
      </li>

     
    </ul>
  </details>
</li>
  <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
      <GrGallery />


      <span className="is-drawer-close:hidden">Pages</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">Add Pages </a>
      </li>
      <li>
        <a href="/sub1">All Pages </a>
      </li>

     
    </ul>
  </details>
</li>
 <li>
  <details>
    <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Career">
      {/* Settings icon */}
       <FaUserPen />


      <span className="is-drawer-close:hidden">Writers Account</span>
    </summary>

    {/* Dropdown items */}
    <ul>
      <li>
        <a href="/sub1">All Writers </a>
      </li>
      <li>
        <a href="/sub1">Id Cards </a>
      </li>
      <li>
        <a href="/sub1">Writers Setting </a>
      </li>
      <li>
        <a href="/sub1">Our Family </a>
      </li>

     
    </ul>
  </details>
</li>
      </ul>
    </div>
  </div>
</div>
    );
};

export default DashboardLayout;