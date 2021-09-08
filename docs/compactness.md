# Compactness

A library of routines to calculate classic measures of compactness -- Reock,
Polsby–Popper, Convex Hull, and Schwartzberg -- as well as the other SmartFeatures
in Kaufman, King, and Komisarchik's "know it when you see it" (KIWYSI) compactness
model that replicates how people assess compactness
([paper](https://gking.harvard.edu/files/gking/files/compact.pdf),
[supplement](https://gking.harvard.edu/files/gking/files/compact_supplement.pdf)).

## Exports

There are 7 features in the simplified KIWYSI PCA model:

* The first 4 measures below are computed using geometric properties of a shape that have been extracted previously, and
* The last 3 take the polygon directly

Extracting the geometric properties of district shapes allows their compactness
to be computed later when the full shapes themselves are no longer available.
Use the [poly package](https://www.npmjs.com/package/@dra2020/poly) to extract the geometric properties.
The properties themselves can either use geodesic (curved earth) or cartesian (flat earth) calculations.

The final routine -- kiwysiScoreShapes -- scores each shape in a GeoJSON feature collection
using the simplified KIWYSI compactness model.

### calcReock (REOCK)

``` TypeScript
export declare function calcReock(area: number, diameter: number): number;
```

Reock is the primary measure of the dispersion of district
shapes, calculated as “the area of the distric to the area of the minimum spanning
circle that can enclose the district.”

> R = A / A(Minimum Bounding Circle)  
> R = A / (π * (D / 2)^2)  
> R = 4A / πD^2

where A is the area of the district and D is the diameter of the minimum bounding circle.

### calcPolsbyPopper (POLSBYPOPPER)

``` TypeScript
export declare function calcPolsbyPopper(area: number, perimeter: number): number;
```

Polsby-Popper is the primary measure of the indendentation
of district shapes, calculated as the “the ratio of the area of the district to
the area of a circle whose circumference is equal to the perimeter of the district.”

> PP = A / A(C)

where C is that circle. In other words:

> P = 2πRc and A(C) = π (P / 2π)^2

where P is the perimeter of the district and Rc is the radius of the circle.

Hence, the measure simplifies to:

> PP = 4π * (A / P^2)

### calcConvexHullFeature (Hull(D))

``` TypeScript
export declare function calcConvexHullFeature(area: number, chArea: number): number;
```

Convex Hull is a secondary measure of the dispersion of
district shapes, calculated as “the ratio of the district area to the area of
the minimum convex bounding polygon(also known as a convex hull) enclosing the
district.”

> CH = A / A(Convex Hull)

where a convex hull is the minimum perimeter that encloses all points in a shape, basically the shortest
unstretched rubber band that fits around the shape.

Note: This is not *the* convex hull, but rather a metric based on it.

### calcSchwartzberg (SCHWARTZBERG)

``` TypeScript
export declare function calcSchwartzberg(area: number, perimeter: number): number;
```

Schwartzberg is a secondary measure of the degree of
indentation of district shapes, calculated as “the ratio of the perimeter of the
district to the circumference of a circle whose area is equal to the area of the
district.”

Azavea [defines Schwartzberg](https://www.azavea.com/blog/2016/07/11/measuring-district-compactness-postgis/) as:

> S = 1 / (P / C)

where P is the perimeter of the district and C is the circumference of the circle. The radius of the circle is:

> Rc = SQRT(A / π)

So, the circumference of the circle is:

> C = 2πRc or C = 2π * SQRT(A / π)

Hence:

> S = 1 (P / 2π \* SQRT(A / π))  
> S = (2π \* SQRT(A / π)) / P

This feature matches the verbal description of P / C(feature_helpers.R).
So, use P/C, not C/P as Azavea describes.

### calcYSymmetry (Y-SYMMETRY)

``` TypeScript
export declare function calcYSymmetry(poly: any): number;
```

The area of a district overlapping with its
reflection around a vertical line going through the centroid, divided by
the area of the district. Values range [1–2].

### calcXSymmetry (X-SYMMETRY)

``` TypeScript
export declare function calcXSymmetry(poly: any): number;
```

The same as Y-SYMMETRY except reflect the district
around a horizontal line going through the centroid.

### calcBoundingBox (BOUNDING-BOX)

``` TypeScript
export declare function calcBoundingBox(poly: any): number;
```

Here this is defined as the ratio of the area of the
district to the area of the minimum bounding box of the district. It's not a
simple bounding box!

### kiwysiScoreShapes

``` TypeScript
export declare function kiwysiScoreShapes(shapes: GeoJSON.FeatureCollection, pca: T.PCAModel, options?: Poly.PolyOptions): number[];
```

Takes a GeoJSON feature collection of shapes and returns an array of 1–100 KIWYSI compactness scores.
For each shape, it:

* Calculates the 7 features above
* Then applies the simplified KIWYSI PCA model, and
* Produces a 1–100 KIWYSI compactness score

Note: These are *ranks* where small is better.

