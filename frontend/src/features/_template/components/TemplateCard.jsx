/**
 * TemplateCard — copy and rename for your feature.
 * Renders a single record in a list view.
 */
const TemplateCard = ({ item }) => {
  return (
    <div className="template-card">
      <h3>{item?.name || 'Unnamed'}</h3>
      <p>{item?.description || 'No description'}</p>
    </div>
  );
};

export default TemplateCard;
