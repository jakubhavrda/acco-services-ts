interface ItemProps {
  title?: string;
  text?: string;
  image?: string; // URL from a CDN?
}

const Item = (props: ItemProps) => {
  const info: ItemProps = {
    title: props.title || "Property",
    text: props.text || "",
    image: props.image || "",
  };

  return (
    <div className="item-container">
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={info.image}
          className="card-img-top"
          alt="Property main image"
        />
        <div className="card-body">
          <h5 className="card-title">{info.title}</h5>
          <p className="card-text">{info.text}</p>
          <a href="#" className="btn btn-outline-dark">
            Book now!
          </a>
        </div>
      </div>
    </div>
  );
};

export default Item;
