export default function serializeForm(formNode: HTMLFormElement) {
    const { elements } = formNode;
    const data = Array.from(elements)
      .filter((item: any) => !!item.name)
      .map((element: any) => {
        const { name, value } = element;
        return { name, value };
      });
    return data;
  }