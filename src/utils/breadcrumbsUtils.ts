export const generateBreadcrumbItems = (pathname: string) => {
    const pathnames = pathname.split("/").filter((x) => x);
    const breadcrumbItems = pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      return { label: value.charAt(0).toUpperCase() + value.slice(1), path: to };
    });
    return breadcrumbItems;
  };
  