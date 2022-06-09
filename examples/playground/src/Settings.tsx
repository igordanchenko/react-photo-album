import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { LayoutType, Photo } from "react-photo-album";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import useLayoutEffect from "./layoutEffect";
import photos from "./photos";

const Filter = ({ children }: { children: ReactNode }) => (
    <Grid item xs={12} sm={8} lg={6}>
        {children}
    </Grid>
);

const SliderControl = ({
    name,
    min,
    max,
    step,
    value,
    onChange,
    disabled,
}: {
    name: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (event: Event, value: number, activeThumb: number) => void;
    disabled?: boolean;
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <FormControl margin="none" fullWidth>
            <InputLabel shrink variant="standard" focused={focused}>
                {name}
            </InputLabel>
            <Slider
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                size="small"
                valueLabelDisplay="auto"
                marks={[
                    { value: min, label: `${min}` },
                    { value: max, label: `${max}` },
                ]}
                onChange={(e, value, activeThumb) =>
                    onChange(e, typeof value === "number" ? value : value[0], activeThumb)
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                sx={{ mt: 2 }}
            />
        </FormControl>
    );
};

type SettingsProps = {
    photos: Photo[];
    layout: LayoutType;
    targetRowHeight: number;
    columns: number;
    spacing: number;
    padding: number;
    width: number;
};

const SettingsContext = createContext<SettingsProps | null>(null);

const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within a SettingsContext");
    return context;
};

const Settings = ({ children }: { children: ReactNode }) => {
    const [layout, setLayout] = useState<LayoutType>("rows");
    const [count, setCount] = useState(photos.length);
    const [targetRowHeight, setTargetRowHeight] = useState(300);
    const [columns, setColumns] = useState(5);
    const [spacing, setSpacing] = useState(30);
    const [padding, setPadding] = useState(10);
    const [width, setWidth] = useState(100);

    useLayoutEffect(() => {
        const viewportSize = window.innerWidth;
        setColumns(viewportSize < 480 ? 2 : viewportSize < 900 ? 3 : 5);
        setSpacing(viewportSize < 480 ? 10 : viewportSize < 900 ? 20 : 30);
        setPadding(viewportSize < 480 ? 10 : viewportSize < 900 ? 20 : 30);
        setTargetRowHeight(viewportSize < 480 ? 100 : viewportSize < 900 ? 150 : 200);
    }, []);

    const settings = useMemo(
        () => ({
            photos: photos.slice(0, count),
            layout,
            targetRowHeight,
            columns,
            spacing,
            padding,
            width,
        }),
        [layout, count, targetRowHeight, columns, spacing, padding, width]
    );

    return (
        <SettingsContext.Provider value={settings}>
            <Paper variant="outlined" sx={{ mb: 4, p: 2, textAlign: "left" }}>
                <Grid container columns={24} rowSpacing={2} columnSpacing={4}>
                    <Filter>
                        <TextField
                            select
                            fullWidth
                            label="Layout"
                            variant="standard"
                            margin="none"
                            value={layout}
                            onChange={(event) => setLayout(event.target.value as LayoutType)}
                        >
                            {[
                                { value: "rows", title: "Rows" },
                                { value: "columns", title: "Columns" },
                                { value: "masonry", title: "Masonry" },
                            ].map(({ value, title }) => (
                                <MenuItem key={value} value={value}>
                                    {title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Filter>

                    <Filter>
                        <SliderControl
                            name="Photos"
                            min={1}
                            max={photos.length}
                            value={count}
                            onChange={(_, value) => setCount(value)}
                        />
                    </Filter>

                    <Filter>
                        <SliderControl
                            name="Spacing"
                            min={0}
                            max={50}
                            value={spacing}
                            onChange={(_, value) => setSpacing(value)}
                        />
                    </Filter>

                    <Filter>
                        <SliderControl
                            name="Padding"
                            min={0}
                            max={50}
                            value={padding}
                            onChange={(_, value) => setPadding(value)}
                        />
                    </Filter>

                    <Filter>
                        <SliderControl
                            name="Row height"
                            min={50}
                            max={500}
                            step={5}
                            value={targetRowHeight}
                            disabled={layout !== "rows"}
                            onChange={(_, value) => setTargetRowHeight(value)}
                        />
                    </Filter>

                    <Filter>
                        <SliderControl
                            name="Columns"
                            min={1}
                            max={10}
                            value={columns}
                            disabled={layout === "rows"}
                            onChange={(_, value) => setColumns(value)}
                        />
                    </Filter>

                    <Filter>
                        <SliderControl
                            name="Width (%)"
                            min={10}
                            max={100}
                            step={5}
                            value={width}
                            onChange={(_, value) => setWidth(value)}
                        />
                    </Filter>
                </Grid>
            </Paper>

            {children}
        </SettingsContext.Provider>
    );
};

export { useSettings };

export default Settings;
