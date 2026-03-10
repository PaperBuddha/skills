# GDELT API Analysis

## Accessibility
The GDELT dataset is entirely free and open. Data can be accessed via:
- Raw data files
- Google BigQuery
- A suite of APIs (DOC, GEO, TV)

## Cost
GDELT is free to use.

## Rate Limits
The GDELT APIs have rate limits, but they are not publicly documented. The limits are in place to protect the underlying infrastructure and exceeding them will result in HTTP 429 errors. A careful and considerate approach to making requests is necessary.

## Data Structure
GDELT provides several massive datasets, most notably:
- **Event Database:** A database of global events.
- **Global Knowledge Graph:** A network of people, organizations, locations, themes, emotions, and events.
The data is updated every 15 minutes.
