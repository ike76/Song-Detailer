import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
//

export const categories = [
  // "Files",
  "Basics",
  "Personnel",
  "Vibes",
  "Sounds",
  "Topics"
];
const SongFormNav = ({ setSongFormPage, currentPage }) => {
  return (
    <div className="nav-tabs-navigation">
      <div className="nav-tabs-wrapper">
        <Nav tabs>
          {categories.map((cat, i) => (
            <NavItem key={cat}>
              <NavLink
                className={currentPage === i ? "active" : ""}
                onClick={() => {
                  setSongFormPage(i);
                }}
                style={{ cursor: "pointer" }}
              >
                {cat}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};
export default SongFormNav;
