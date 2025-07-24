import Item from "./Item";

interface ListProps {
  properties: {
    title: string;
    text: string;
    image: string;
  }[];
}

const List = (props: ListProps) => {
  return (
    <div className="list-container">
      <h3>Need a family vacation? Or just a weekend getaway with friends?</h3>
      <h3>Look no further!</h3>
      <div className="item-list">
        {props.properties.length > 0 ? (
          props.properties.map((property, index) => (
            <Item
              key={index}
              title={property.title}
              text={property.text}
              image={property.image}
            />
          ))
        ) : (
          <h2 className="mt-5">No property available</h2>
        )}
      </div>
    </div>
  );
};

export default List;
