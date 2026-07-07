"use client";

import { Map, Marker } from "@vis.gl/react-google-maps";
import { ExternalLink, MapPin } from "lucide-react";

import { isGoogleMapsConfigured } from "@/components/civicai/maps/google-maps-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getGoogleMapsDirectionsUrl,
  type OfficeLocation,
} from "@/lib/civicai/office-locations";

type OfficeMapProps = {
  location: OfficeLocation;
  title?: string;
  className?: string;
  height?: number;
};

function MapFallback({ location, title, height = 240 }: OfficeMapProps) {
  const directionsUrl = getGoogleMapsDirectionsUrl(location);

  return (
    <Card>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="size-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        <div>
          <p className="font-medium">{location.officeName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{location.officeAddress}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {location.city}, Pakistan
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground"
          style={{ height }}
        >
          {isGoogleMapsConfigured()
            ? "Loading map..."
            : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive map"}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-full",
          })}
        >
          <ExternalLink className="size-4" />
          Open in Google Maps
        </a>
      </CardContent>
    </Card>
  );
}

export function OfficeMap({
  location,
  title = "Facility / Hotspot Location",
  className,
  height = 240,
}: OfficeMapProps) {
  const directionsUrl = getGoogleMapsDirectionsUrl(location);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <MapFallback location={location} title={title} height={height} />;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-medium">{location.officeName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{location.officeAddress}</p>
        </div>
        <div
          className="overflow-hidden rounded-xl border border-border"
          style={{ height }}
        >
          <Map
            defaultCenter={{ lat: location.lat, lng: location.lng }}
            defaultZoom={15}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            style={{ width: "100%", height: "100%" }}
          >
            <Marker
              position={{ lat: location.lat, lng: location.lng }}
              title={location.officeName}
            />
          </Map>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-full",
          })}
        >
          <ExternalLink className="size-4" />
          Get Directions
        </a>
      </CardContent>
    </Card>
  );
}
