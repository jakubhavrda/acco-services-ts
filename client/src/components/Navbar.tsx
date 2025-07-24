interface Props {
  logo: string;
  features: string[];
}

const Navbar = ({ logo, features }: Props) => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src={logo || "/docs/5.3/assets/brand/bootstrap-logo.svg"}
            alt="logo"
            width="50"
            height="50"
          />
        </a>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {features.map((feature, index) => (
            <a
              className="nav-item nav-link text-dark"
              style={{ fontSize: "1.2rem" }}
              key={index}
              href={`${feature.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <li>
                <span>{feature}</span>
              </li>
            </a>
          ))}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
