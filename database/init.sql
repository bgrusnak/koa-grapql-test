BEGIN;
create extension if not exists "uuid-ossp";
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.person_slots DROP CONSTRAINT IF EXISTS lnk_slots_person_slots;
ALTER TABLE IF EXISTS ONLY public.slot DROP CONSTRAINT IF EXISTS lnk_schedules_slots;
ALTER TABLE IF EXISTS ONLY public.talk DROP CONSTRAINT IF EXISTS lnk_person_talks;
ALTER TABLE IF EXISTS ONLY public.person_slots DROP CONSTRAINT IF EXISTS lnk_person_person_slots;
ALTER TABLE IF EXISTS ONLY public.person_events DROP CONSTRAINT IF EXISTS lnk_person_person_events;
ALTER TABLE IF EXISTS ONLY public.talk DROP CONSTRAINT IF EXISTS lnk_events_talks;
ALTER TABLE IF EXISTS ONLY public.schedule DROP CONSTRAINT IF EXISTS lnk_events_schedules;
ALTER TABLE IF EXISTS ONLY public.person_events DROP CONSTRAINT IF EXISTS lnk_events_person_events;
DROP INDEX IF EXISTS public.talks_type;
DROP INDEX IF EXISTS public.talks_person;
DROP INDEX IF EXISTS public.talks_event1;
DROP INDEX IF EXISTS public.sponsor_rating;
DROP INDEX IF EXISTS public.sponsor_name;
DROP INDEX IF EXISTS public.slots_tags;
DROP INDEX IF EXISTS public.slots_slot;
DROP INDEX IF EXISTS public.schedules_title;
DROP INDEX IF EXISTS public.schedules_event;
DROP INDEX IF EXISTS public.schedules_date;
DROP INDEX IF EXISTS public.person_url;
DROP INDEX IF EXISTS public.person_twitter;
DROP INDEX IF EXISTS public.person_role;
DROP INDEX IF EXISTS public."person_lastName";
DROP INDEX IF EXISTS public.person_github;
DROP INDEX IF EXISTS public."person_firstName";
DROP INDEX IF EXISTS public.person_events_mutual;
DROP INDEX IF EXISTS public.person_events_index;
DROP INDEX IF EXISTS public.person_events_event;
DROP INDEX IF EXISTS public."index_startDate";
DROP INDEX IF EXISTS public."events_websiteUrl";
DROP INDEX IF EXISTS public."events_venueName";
DROP INDEX IF EXISTS public."events_venueCountry";
DROP INDEX IF EXISTS public."events_venueCity";
DROP INDEX IF EXISTS public."events_twitterHandle";
DROP INDEX IF EXISTS public."events_timezoneId";
DROP INDEX IF EXISTS public.events_name;
ALTER TABLE IF EXISTS ONLY public.talk DROP CONSTRAINT IF EXISTS unique_talks_id;
ALTER TABLE IF EXISTS ONLY public.sponsor DROP CONSTRAINT IF EXISTS unique_sponsor_id;
ALTER TABLE IF EXISTS ONLY public.schedule DROP CONSTRAINT IF EXISTS unique_schedules_id;
ALTER TABLE IF EXISTS ONLY public.person_events DROP CONSTRAINT IF EXISTS unique_person_events_id;
ALTER TABLE IF EXISTS ONLY public.event DROP CONSTRAINT IF EXISTS unique_events_slug;
ALTER TABLE IF EXISTS ONLY public.event DROP CONSTRAINT IF EXISTS unique_events_id;
ALTER TABLE IF EXISTS ONLY public.slot DROP CONSTRAINT IF EXISTS slots_pkey;
ALTER TABLE IF EXISTS ONLY public.person_slots DROP CONSTRAINT IF EXISTS person_slots_pkey;
ALTER TABLE IF EXISTS ONLY public.person DROP CONSTRAINT IF EXISTS person_pkey;
DROP TABLE IF EXISTS public.talk;
DROP TABLE IF EXISTS public.sponsor;
DROP TABLE IF EXISTS public.slot;
DROP TABLE IF EXISTS public.schedule;
DROP TABLE IF EXISTS public.person_slots;
DROP TABLE IF EXISTS public.person_events;
DROP TABLE IF EXISTS public.person;
DROP TABLE IF EXISTS public.event;
DROP TYPE IF EXISTS public.ratings;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: ratings; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ratings AS ENUM (
    'partner',
    'gold',
    'platinum',
    'diamond'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event (
    id integer NOT NULL,
    "cocUrl" character varying(400),
    description character varying(2044),
    name character varying(400) NOT NULL,
    "offset" integer,
    slug character varying(400) NOT NULL,
    "timezoneId" character varying(80),
    "twitterHandle" character varying(80),
    "venueCity" character varying(200),
    "venueCountry" character varying(80),
    "venueName" character varying(200),
    "websiteUrl" character varying(200),
    "hasEnded" boolean DEFAULT false NOT NULL,
    "hasStarted" boolean DEFAULT false NOT NULL,
    "onGoing" boolean DEFAULT false NOT NULL,
    "nextFiveScheduledItems" jsonb,
    "startDate" timestamp with time zone NOT NULL
);


--
-- Name: person; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person (
    id integer NOT NULL,
    "avatarUrl" character varying(400),
    "firstName" character varying(200) NOT NULL,
    github character varying(200),
    "lastName" character varying(200) NOT NULL,
    role character varying(20) NOT NULL,
    twitter character varying(200),
    url character varying(400),
    bio text
);


--
-- Name: person_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    event integer NOT NULL,
    person integer NOT NULL
);


--
-- Name: person_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_slots (
    person integer NOT NULL,
    slot integer NOT NULL
);


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date time with time zone NOT NULL,
    title character varying(400) NOT NULL,
    event integer NOT NULL
);


--
-- Name: slot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slot (
    id integer NOT NULL,
    schedule uuid NOT NULL,
    keynote text,
    length integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    room integer,
    "startDate" time with time zone NOT NULL,
    tags text DEFAULT ''::text NOT NULL,
    talk text,
    title character varying(400) NOT NULL,
    type integer NOT NULL,
    "youtubeId" character varying(200) DEFAULT ''::character varying NOT NULL,
    "youtubeUrl" character varying(400) DEFAULT ''::character varying NOT NULL
);


--
-- Name: sponsor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sponsor (
    id integer NOT NULL,
    description text,
    "jobUrl" character varying(400),
    "logoUrl" character varying(400),
    name character varying(200) NOT NULL,
    url character varying(400),
    rating public.ratings NOT NULL
);


--
-- Name: talk; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.talk (
    id integer NOT NULL,
    description text NOT NULL,
    length integer NOT NULL,
    title character varying(400) NOT NULL,
    type integer NOT NULL,
    person integer NOT NULL,
    event integer NOT NULL,
    "startDate" timestamp with time zone NOT NULL
);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person_slots person_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person_slots
    ADD CONSTRAINT person_slots_pkey PRIMARY KEY (person, slot);


--
-- Name: slot slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.slot
    ADD CONSTRAINT slots_pkey PRIMARY KEY (id);


--
-- Name: event unique_events_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.event
    ADD CONSTRAINT unique_events_id PRIMARY KEY (id);


--
-- Name: event unique_events_slug; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.event
    ADD CONSTRAINT unique_events_slug UNIQUE (slug);


--
-- Name: person_events unique_person_events_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person_events
    ADD CONSTRAINT unique_person_events_id UNIQUE (id);


--
-- Name: schedule unique_schedules_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.schedule
    ADD CONSTRAINT unique_schedules_id PRIMARY KEY (id);


--
-- Name: sponsor unique_sponsor_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.sponsor
    ADD CONSTRAINT unique_sponsor_id PRIMARY KEY (id);


--
-- Name: talk unique_talks_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.talk
    ADD CONSTRAINT unique_talks_id PRIMARY KEY (id);


--
-- Name: events_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_name ON public.event USING btree (name);


--
-- Name: events_timezoneId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_timezoneId" ON public.event USING btree ("timezoneId");


--
-- Name: events_twitterHandle; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_twitterHandle" ON public.event USING btree ("twitterHandle");


--
-- Name: events_venueCity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_venueCity" ON public.event USING btree ("venueCity");


--
-- Name: events_venueCountry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_venueCountry" ON public.event USING btree ("venueCountry");


--
-- Name: events_venueName; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_venueName" ON public.event USING btree ("venueName");


--
-- Name: events_websiteUrl; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "events_websiteUrl" ON public.event USING btree ("websiteUrl");


--
-- Name: index_startDate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "index_startDate" ON public.talk USING btree ("startDate");


--
-- Name: person_events_event; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_events_event ON public.person_events USING btree (event);


--
-- Name: person_events_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_events_index ON public.person_events USING btree (person);


--
-- Name: person_events_mutual; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX person_events_mutual ON public.person_events USING btree (event, person);


--
-- Name: person_firstName; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "person_firstName" ON public.person USING btree ("firstName");


--
-- Name: person_github; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_github ON public.person USING btree (github);


--
-- Name: person_lastName; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "person_lastName" ON public.person USING btree ("lastName");


--
-- Name: person_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_role ON public.person USING btree (role);


--
-- Name: person_twitter; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_twitter ON public.person USING btree (twitter);


--
-- Name: person_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_url ON public.person USING btree (url);


--
-- Name: schedules_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_date ON public.schedule USING btree (date);


--
-- Name: schedules_event; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_event ON public.schedule USING btree (event);


--
-- Name: schedules_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedules_title ON public.schedule USING btree (title);


--
-- Name: slots_slot; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX slots_slot ON public.slot USING btree (schedule);


--
-- Name: slots_tags; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX slots_tags ON public.slot USING btree (tags);


--
-- Name: sponsor_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sponsor_name ON public.sponsor USING btree (name);


--
-- Name: sponsor_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sponsor_rating ON public.sponsor USING btree (rating);


--
-- Name: talks_event1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX talks_event1 ON public.talk USING btree (event);


--
-- Name: talks_person; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX talks_person ON public.talk USING btree (person);


--
-- Name: talks_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX talks_type ON public.talk USING btree (type);


--
-- Name: person_events lnk_events_person_events; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person_events
    ADD CONSTRAINT lnk_events_person_events FOREIGN KEY (event) REFERENCES public.event(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedule lnk_events_schedules; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.schedule
    ADD CONSTRAINT lnk_events_schedules FOREIGN KEY (event) REFERENCES public.event(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: talk lnk_events_talks; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.talk
    ADD CONSTRAINT lnk_events_talks FOREIGN KEY (event) REFERENCES public.event(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: person_events lnk_person_person_events; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person_events
    ADD CONSTRAINT lnk_person_person_events FOREIGN KEY (person) REFERENCES public.person(id) MATCH FULL ON UPDATE CASCADE;


--
-- Name: person_slots lnk_person_person_slots; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person_slots
    ADD CONSTRAINT lnk_person_person_slots FOREIGN KEY (person) REFERENCES public.person(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: talk lnk_person_talks; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.talk
    ADD CONSTRAINT lnk_person_talks FOREIGN KEY (person) REFERENCES public.person(id) MATCH FULL ON UPDATE CASCADE;


--
-- Name: slot lnk_schedules_slots; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.slot
    ADD CONSTRAINT lnk_schedules_slots FOREIGN KEY (schedule) REFERENCES public.schedule(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: person_slots lnk_slots_person_slots; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE IF EXISTS ONLY public.person_slots
    ADD CONSTRAINT lnk_slots_person_slots FOREIGN KEY (slot) REFERENCES public.slot(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


COMMIT;
